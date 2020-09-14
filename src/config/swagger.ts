import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    info: {
      title: 'Very useful tools to remember REST API',
      description: 'This is the swagger documentation of the Very useful tools to remember REST API',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'tool',
        description: 'Operations about tools',
      },
      {
        name: 'user',
        description: 'Operations about users',
      },
      {
        name: 'session',
        description: 'Operations about sessions',
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    basePath: '/',
    paths: {
      '/tools': {
        get: {
          tags: ['tool'],
          summary: 'List user tools',
          description: 'To access this route you must be authenticated.',
          parameters: [
            {
              in: 'query',
              name: 'tag',
              description: 'Sets the tag that will be used to filter tools.',
              required: false,
              example: 'organization',
            },
            {
              in: 'query',
              name: 'page',
              description: 'Sets the page number for pagination.',
              required: false,
              example: 1,
            },
            {
              in: 'query',
              name: 'limit',
              description: 'Sets the number of tools per response.',
              required: false,
              example: 5,
            },
            {
              in: 'header',
              name: 'Authorization',
              type: 'string',
              description: 'Bearer token',
              required: true,
              example: 'Bearer eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
            },
          ],
          responses: {
            200: {
              description: 'Tools successfully listed',
              schema: {
                properties: {
                  tools: {
                    type: 'string',
                    items: {
                      type: 'object',
                    },
                    example: [
                      {
                        id: 'e8511396-8b62-44f6-a1d4-1947bb3ae89b',
                        title: 'Notion',
                        link: 'https://notion.so',
                        description:
                          'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
                        tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
                      },
                    ],
                  },
                  current_page: {
                    type: 'integer',
                    example: 1,
                  },
                  total_pages: {
                    type: 'integer',
                    example: 1,
                  },
                },
              },
            },
          },
          security: ['vuttr_auth'],
        },
        post: {
          tags: ['tool'],
          summary: 'Create tool',
          description: 'To access this route you must be authenticated.',
          parameters: [
            {
              in: 'body',
              name: 'body',
              description: 'Tool data.',
              required: true,
              schema: {
                properties: {
                  title: {
                    type: 'string',
                    example: 'Notion',
                  },
                  link: {
                    type: 'string',
                    example: 'https://notion.so',
                  },
                  description: {
                    type: 'string',
                    example:
                      'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
                  },
                },
              },
            },
            {
              in: 'header',
              name: 'Authorization',
              type: 'string',
              description: 'Bearer token',
              required: true,
              example: 'Bearer eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
            },
          ],
          responses: {
            201: {
              description: 'Tool successfully created',
              schema: {
                properties: {
                  id: {
                    type: 'string',
                    example: '871f5220-c654-45ec-b766-2da621602d19',
                  },
                  title: {
                    type: 'string',
                    example: 'Notion',
                  },
                  link: {
                    type: 'string',
                    example: 'https://notion.so',
                  },
                  description: {
                    type: 'string',
                    example:
                      'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
                  },
                  tags: {
                    type: 'aray',
                    items: {
                      type: 'string',
                    },
                    example: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
                  },
                },
              },
            },
            400: {
              description: 'Validation fails',
              schema: {
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                  message: {
                    type: 'string',
                    example: "The 'title' field mustn't be empty.",
                  },
                  validation: {
                    properties: {
                      source: {
                        type: 'string',
                        example: 'body',
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['title'],
                      },
                    },
                  },
                },
              },
            },
            409: {
              description: 'Tool already exists',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Tool already created.',
                  },
                },
              },
            },
          },
          security: ['vuttr_auth'],
        },
      },
      '/tools/{toolId}': {
        put: {
          tags: ['tool'],
          summary: 'Update tool',
          description: 'To access this route you must be authenticated.',
          parameters: [
            {
              in: 'params',
              name: 'toolId',
              description: 'Tool id',
              required: true,
              example: '871f5220-c654-45ec-b766-2da621602d19',
            },
            {
              in: 'body',
              name: 'body',
              description: 'Tool data.',
              required: true,
              schema: {
                properties: {
                  title: {
                    type: 'string',
                    example: 'Notion',
                  },
                  link: {
                    type: 'string',
                    example: 'https://notion.so',
                  },
                  description: {
                    type: 'string',
                    example:
                      'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
                  },
                },
              },
            },
            {
              in: 'header',
              name: 'Authorization',
              type: 'string',
              description: 'Bearer token',
              required: true,
              example: 'Bearer eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
            },
          ],
          responses: {
            200: {
              description: 'Tool successfully updated',
              schema: {
                properties: {
                  id: {
                    type: 'string',
                    example: '871f5220-c654-45ec-b766-2da621602d19',
                  },
                  title: {
                    type: 'string',
                    example: 'Notion',
                  },
                  link: {
                    type: 'string',
                    example: 'https://notion.so',
                  },
                  description: {
                    type: 'string',
                    example:
                      'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
                  },
                  tags: {
                    type: 'aray',
                    items: {
                      type: 'string',
                    },
                    example: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
                  },
                },
              },
            },
            400: {
              description: 'Validation fails',
              schema: {
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                  message: {
                    type: 'string',
                    example: "The 'title' field mustn't be empty.",
                  },
                  validation: {
                    properties: {
                      source: {
                        type: 'string',
                        example: 'body',
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['title'],
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Tool not found',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Tool not found.',
                  },
                },
              },
            },
            409: {
              description: 'Tool already exists',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Tool already created.',
                  },
                },
              },
            },
          },
          security: ['vuttr_auth'],
        },
        delete: {
          tags: ['tool'],
          summary: 'Delete tool',
          description: 'To access this route you must be authenticated.',
          parameters: [
            {
              in: 'params',
              name: 'toolId',
              description: 'Tool id',
              required: true,
              example: '871f5220-c654-45ec-b766-2da621602d19',
            },
            {
              in: 'header',
              name: 'Authorization',
              type: 'string',
              description: 'Bearer token',
              required: true,
              example: 'Bearer eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
            },
          ],
          responses: {
            204: {
              description: 'Tool successfully deleted',
            },
            400: {
              description: 'Validation fails',
              schema: {
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                  message: {
                    type: 'string',
                    example: "The 'toolId' must be a valid UUID.",
                  },
                  validation: {
                    properties: {
                      source: {
                        type: 'string',
                        example: 'body',
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['id'],
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Tool not found',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Tool not found.',
                  },
                },
              },
            },
          },
          security: ['vuttr_auth'],
        },
      },
      '/users': {
        post: {
          tags: ['user'],
          summary: 'Create user',
          parameters: [
            {
              in: 'body',
              name: 'body',
              description: 'User data.',
              required: true,
              schema: {
                properties: {
                  name: {
                    type: 'string',
                    example: 'Greyson Mascarenhas Santos Filho',
                  },
                  email: {
                    type: 'string',
                    example: 'greysonmrx@gmail.com',
                  },
                  password: {
                    type: 'string',
                    example: '123456',
                  },
                },
              },
            },
          ],
          responses: {
            201: {
              description: 'User successfully created',
              schema: {
                properties: {
                  id: {
                    type: 'string',
                    example: '871f5220-c654-45ec-b766-2da621602d19',
                  },
                  name: {
                    type: 'string',
                    example: 'Greyson Mascarenhas Santos Filho',
                  },
                  email: {
                    type: 'string',
                    example: 'greysonmrx@gmail.com',
                  },
                },
              },
            },
            400: {
              description: 'Validation fails',
              schema: {
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                  message: {
                    type: 'string',
                    example: "The 'email' field mustn't be empty.",
                  },
                  validation: {
                    properties: {
                      source: {
                        type: 'string',
                        example: 'body',
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['email'],
                      },
                    },
                  },
                },
              },
            },
            409: {
              description: 'User already exists',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Email address already used.',
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['user'],
          summary: 'Update user',
          description: 'To access this route you must be authenticated.',
          parameters: [
            {
              in: 'body',
              name: 'body',
              description: 'User data.',
              required: true,
              schema: {
                properties: {
                  name: {
                    type: 'string',
                    example: 'Greyson Mascarenhas Santos Filho',
                  },
                  email: {
                    type: 'string',
                    example: 'greysonmrx@gmail.com',
                  },
                  current_password: {
                    type: 'string',
                    example: '123456',
                  },
                  password: {
                    type: 'string',
                    example: '654321',
                  },
                },
              },
            },
            {
              in: 'header',
              name: 'Authorization',
              type: 'string',
              description: 'Bearer token',
              required: true,
              example: 'Bearer eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
            },
          ],
          responses: {
            200: {
              description: 'User successfully updated',
              schema: {
                properties: {
                  id: {
                    type: 'string',
                    example: '871f5220-c654-45ec-b766-2da621602d19',
                  },
                  name: {
                    type: 'string',
                    example: 'Greyson Mascarenhas Santos Filho',
                  },
                  email: {
                    type: 'string',
                    example: 'greysonmrx@gmail.com',
                  },
                },
              },
            },
            400: {
              description: 'Validation fails',
              schema: {
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                  message: {
                    type: 'string',
                    example: "The 'email' field mustn't be empty.",
                  },
                  validation: {
                    properties: {
                      source: {
                        type: 'string',
                        example: 'body',
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['email'],
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'User not found',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'User not found.',
                  },
                },
              },
            },
            409: {
              description: 'User already exists',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Email address already used.',
                  },
                },
              },
            },
          },
          security: ['vuttr_auth'],
        },
        delete: {
          tags: ['user'],
          summary: 'Create user',
          description: 'To access this route you must be authenticated.',
          parameters: [
            {
              in: 'header',
              name: 'Authorization',
              type: 'string',
              description: 'Bearer token',
              required: true,
              example: 'Bearer eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
            },
          ],
          responses: {
            204: {
              description: 'User successfully created',
            },
            404: {
              description: 'User not found',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'User not found.',
                  },
                },
              },
            },
          },
          security: ['vuttr_auth'],
        },
      },
      '/sessions': {
        post: {
          tags: ['session'],
          summary: 'Authenticate user',
          parameters: [
            {
              in: 'body',
              name: 'body',
              description: 'User credentials.',
              required: true,
              schema: {
                properties: {
                  email: {
                    type: 'string',
                    example: 'greysonmrx@gmail.com',
                  },
                  password: {
                    type: 'string',
                    example: '123456',
                  },
                },
              },
            },
          ],
          responses: {
            201: {
              description: 'User successfully authenticated',
              schema: {
                properties: {
                  user: {
                    properties: {
                      id: {
                        type: 'string',
                        example: 'b8ba98c6-58ea-49ae-b999-c39e24fda2ef',
                      },
                      email: {
                        type: 'string',
                        example: 'greysonmrx@gmail.com',
                      },
                      password: {
                        type: 'string',
                        example: '123456',
                      },
                    },
                  },
                  token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUNiIsInR5c.eyJpYXQiOjE1OTk3ktYzM5ZTI0Z.3WOMawAN2PORaoE87ZOWrK',
                  },
                },
              },
            },
            400: {
              description: 'Validation fails',
              schema: {
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                  message: {
                    type: 'string',
                    example: "The 'email' field mustn't be empty.",
                  },
                  validation: {
                    properties: {
                      source: {
                        type: 'string',
                        example: 'body',
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['email'],
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Incorrect email address or password',
              schema: {
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  message: {
                    type: 'string',
                    example: 'Incorrect email/password combination.',
                  },
                },
              },
            },
          },
        },
      },
    },
    definitions: {
      Tool: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          user_id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
          },
          link: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            unique: true,
          },
          password: {
            type: 'string',
          },
          created_at: {
            type: 'string',
          },
          updated_at: {
            type: 'string',
          },
        },
        xml: {
          name: 'User',
        },
      },
    },
  },
  apis: ['src/modules/**/infra/http/routes/*.routes.ts'],
};

export default swaggerOptions;
