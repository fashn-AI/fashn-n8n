import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow';

export class Fashn implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fashn',
		name: 'fashn',
		icon: 'file:fashn.svg',
		group: ['transform'],
		version: [1, 0, 0],
		description: 'Fashn API',
		defaults: {
			name: 'Fashn',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'fashnApi',
				required: true,
			},
		],
		properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          {
            name: 'Virtual try-on',
            value: 'virtualTryOn'
          }
        ],
        default: 'virtualTryOn',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'virtualTryOn',
            ],
          },
        },
        options: [
          {
            name: 'Post',
            value: 'post',
            action: 'Generate a virtual try-on',
            description: 'Generate a virtual try-on',

          }
        ],
        default: 'post',
      },
      {
        displayName: 'Model Image',
        name: 'model_image',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        required: true,
        default: '',
        description: 'URL or base64 encoded image of the model',
        placeholder: 'https://example.com/model.jpg or data:image/jpeg;base64,...',
        hint: 'Primary image of the person on whom the virtual try-on will be performed.',
      },
      {
        displayName: 'Garment Image',
        name: 'garment_image',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        required: true,
        default: '',
        description: 'URL or base64 encoded image of the garment',
        placeholder: 'https://example.com/garment.jpg or data:image/jpeg;base64,...',
        hint: 'Reference image of the clothing item to be tried on the model_image.',
      },
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        options: [
          {
            name: 'Auto',
            value: 'auto',
          },
          {
            name: 'Tops',
            value: 'tops',
          },
          {
            name: 'Bottoms',
            value: 'bottoms',
          },
          {
            name: 'One-pieces',
            value: 'one-pieces',
          },
        ],
        default: 'auto',
        description: 'Category of the garment',
      },
      {
        displayName: 'Segmentation Free',
        name: 'segmentation_free',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        default: true,
        description: 'Whether to use segmentation-free processing',
      },
      {
        displayName: 'Moderation Level',
        name: 'moderation_level',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        options: [
          {
            name: 'Conservative',
            value: 'conservative',
          },
          {
            name: 'Permissive',
            value: 'permissive',
          },
          {
            name: 'None',
            value: 'none',
          },
        ],
        default: 'permissive',
        description: 'Content moderation level',
      },
      {
        displayName: 'Garment Photo Type',
        name: 'garment_photo_type',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        options: [
          {
            name: 'Auto',
            value: 'auto',
          },
          {
            name: 'Flat-lay',
            value: 'flat-lay',
          },
          {
            name: 'Model',
            value: 'model',
          },
        ],
        default: 'auto',
        description: 'Type of garment photo',
      },
      {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        options: [
          {
            name: 'Performance',
            value: 'performance',
          },
          {
            name: 'Balanced',
            value: 'balanced',
          },
          {
            name: 'Quality',
            value: 'quality',
          },
        ],
        default: 'balanced',
        description: 'Processing mode balancing speed and quality',
      },
      {
        displayName: 'Seed',
        name: 'seed',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        default: 42,
        typeOptions: {
          minValue: 0,
          maxValue: 4294967295,
        },
        description: 'Random seed for reproducible results (0 to 2^32-1)',
      },
      {
        displayName: 'Number of Samples',
        name: 'num_samples',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        default: 1,
        typeOptions: {
          minValue: 1,
          maxValue: 4,
        },
        description: 'Number of output samples to generate (1-4)',
      },
      {
        displayName: 'Output Format',
        name: 'output_format',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        options: [
          {
            name: 'PNG',
            value: 'png',
          },
          {
            name: 'JPEG',
            value: 'jpeg',
          },
        ],
        default: 'png',
        description: 'Output image format',
      },
      {
        displayName: 'Return Base64',
        name: 'return_base64',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['virtualTryOn'],
            operation: ['post'],
          },
        },
        default: false,
        description: 'Whether to return images as base64 encoded strings',
      }
    ],
	};

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        if (resource === 'virtualTryOn' && operation === 'post') {
          // Get all parameters
          const model_image = this.getNodeParameter('model_image', i) as string;
          const garment_image = this.getNodeParameter('garment_image', i) as string;
          const category = this.getNodeParameter('category', i) as string;
          const segmentation_free = this.getNodeParameter('segmentation_free', i) as boolean;
          const moderation_level = this.getNodeParameter('moderation_level', i) as string;
          const garment_photo_type = this.getNodeParameter('garment_photo_type', i) as string;
          const mode = this.getNodeParameter('mode', i) as string;
          const seed = this.getNodeParameter('seed', i) as number;
          const num_samples = this.getNodeParameter('num_samples', i) as number;
          const output_format = this.getNodeParameter('output_format', i) as string;
          const return_base64 = this.getNodeParameter('return_base64', i) as boolean;

          // Step 1: Make the initial API call
          const initialResponse = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'fashnApi',
            {
              method: 'POST',
              url: 'https://api.fashn.ai/v1/run',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model_image,
                garment_image,
                category,
                segmentation_free,
                moderation_level,
                garment_photo_type,
                mode,
                seed,
                num_samples,
                output_format,
                return_base64,
              }),
            },
          );

          // Extract the job ID from the response
          const responseData = initialResponse;
          if (!responseData || typeof responseData !== 'object') {
            throw new NodeOperationError(
              this.getNode(),
              'Invalid response from API: Expected object with job ID',
            );
          }

          const jobId = responseData.id;
          if (!jobId) {
            throw new NodeOperationError(
              this.getNode(),
              'No job ID returned from API',
            );
          }

          // Step 2: Poll the status endpoint
          const timeout = 25 * 1000; // 25 seconds
          const pollInterval = 5 * 1000; // 5 seconds
          const startTime = Date.now();
          let finalResult: any;

          while (Date.now() - startTime < timeout) {
            try {
              const statusResponse = await this.helpers.httpRequestWithAuthentication.call(
                this,
                'fashnApi',
                {
                  method: 'GET',
                  url: `https://api.fashn.ai/v1/status/${jobId}`,
                  headers: {
                    'Accept': 'application/json',
                  },
                },
              );

              const statusData = statusResponse;

              if (statusData.status === 'completed') {
                finalResult = statusData;
                break;
              } else if (statusData.status === 'failed') {
                throw new NodeOperationError(
                  this.getNode(),
                  `Job failed: ${statusData.error || 'Unknown error'}`,
                );
              }

              // Wait before next poll
              if (Date.now() - startTime < timeout - pollInterval) {
                await new Promise<void>(resolve => {
                  // Use the global setTimeout function
                  (globalThis as any).setTimeout(resolve, pollInterval);
                });
              }
            } catch (error) {
              if (error instanceof NodeOperationError) {
                throw error;
              }
              throw new NodeOperationError(
                this.getNode(),
                `Error polling status: ${error.message}`,
              );
            }
          }

          if (!finalResult) {
            throw new NodeOperationError(
              this.getNode(),
              `Job timed out after ${timeout / 1000} seconds`,
            );
          }

          returnData.push({
            json: finalResult,
            pairedItem: { item: i },
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: i },
          });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}
