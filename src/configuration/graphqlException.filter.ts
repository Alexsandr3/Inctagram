import { GraphQLError, GraphQLErrorExtensions } from 'graphql/error';

export class GraphqlExceptionFilter extends GraphQLError {
  extensions: GraphQLErrorExtensions;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.extensions = {
      statusCode: statusCode,
    };
  }
}
