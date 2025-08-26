import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import { default as FashnApi } from 'fashn';

export class Fashn implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FASHN',
		name: 'fashn',
		icon: 'file:fashn.svg',
		group: ['transform'],
		version: [1, 0, 0],
		description: 'FASHN AI is a virtual try-on platform that generates realistic try-on images by combining model photos with garment images using advanced AI technology.',
		defaults: {
			name: 'FASHN',
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
        noDataExpression: true,
        options: [
          {
            name: 'Virtual Try-On',
            value: 'virtualTryOn'
          }
        ],
        default: 'virtualTryOn',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
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
            action: 'Generate a virtual try on',
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
            name: 'One-Pieces',
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
            name: 'Flat-Lay',
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

          const credentials = await this.getCredentials('fashnApi');
          const apiKey = credentials.apiKey as string;

          const client = new FashnApi({
            apiKey: apiKey
          });

          const params: FashnApi.PredictionSubscribeParams = {
            inputs: {
              garment_image: garment_image,
              model_image: model_image,
              category: category as 'auto' | 'tops' | 'bottoms' | 'one-pieces',
              segmentation_free: segmentation_free,
              moderation_level: moderation_level as 'conservative' | 'permissive' | 'none',
              garment_photo_type: garment_photo_type as 'auto' | 'flat-lay' | 'model',
              mode: mode as 'performance' | 'balanced' | 'quality',
              seed: seed,
              num_samples: num_samples,
              output_format: output_format as 'png' | 'jpeg',
              return_base64: return_base64,
            },
            model_name: 'tryon-v1.6',
          };

          const response = await client.predictions.subscribe(params);
          
          let output = '';
          if (response.output && response.output.length > 0) {
            output = response.output[0];
          }

          returnData.push({
            json: { output: output },
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
