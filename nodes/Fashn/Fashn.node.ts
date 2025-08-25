import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

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
    requestDefaults: {
      baseURL: 'https://api-staging.fashn.ai',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
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
            routing: {
              request: {
                method: 'POST',
                url: '/v1/run',
                body: {
                  model_image: '={{ $parameter.model_image }}',
                  garment_image: '={{ $parameter.garment_image }}',
                  category: '={{ $parameter.category }}',
                  segmentation_free: '={{ $parameter.segmentation_free }}',
                  moderation_level: '={{ $parameter.moderation_level }}',
                  garment_photo_type: '={{ $parameter.garment_photo_type }}',
                  mode: '={{ $parameter.mode }}',
                  seed: '={{ $parameter.seed }}',
                  num_samples: '={{ $parameter.num_samples }}',
                  output_format: '={{ $parameter.output_format }}',
                  return_base64: '={{ $parameter.return_base64 }}'
                }
              }
            }
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
}
