import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

const baseUrlTest = '/test';
export const endpointsTest = {
  deleteDB: () => `${baseUrlTest}/delete-all`,
};

@ApiTags('Testing')
@Controller(baseUrlTest)
export class TestingController {
  constructor(protected testingService: TestingService) {}

  /**
   * Clear database: delete all data from all tables/collections
   */
  @ApiOperation({
    summary: 'Clear database: delete all data from all tables/collections',
  })
  @ApiResponse({ status: 204, description: 'success' })
  @Delete(endpointsTest.deleteDB())
  @HttpCode(204)
  async deleteDB() {
    return await this.testingService.truncateDBTables();
  }
  @Get()
  async test() {
    return 'test';
  }
}
