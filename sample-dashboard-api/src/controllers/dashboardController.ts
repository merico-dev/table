import { IsObject, Length, IsString, IsOptional, IsIn, ValidateNested, IsInt, IsUUID } from 'class-validator';
import express from 'express';
import { DashboardService } from '../services/app/dashboard_service';
import { ApiError, NOT_FOUND } from '../utils/errors';
import { validate } from '../middlewares/validation'
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';

class DashboardFilter {
  @IsString()
  search: string;
}

class DashboardSort {
  @IsString()
  @IsIn(['name', 'create_time'])
  field: string;

  @IsIn(['ASC', 'DESC'])
  order: string;
}

class DashboardPagination {
  @IsInt()
  page: number;

  @IsInt()
  pagesize: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class ListDashboardRequest {
  @IsOptional()
  @Type(() => DashboardFilter)
  @ValidateNested({ each: true })
  filter?: DashboardFilter;

  @IsOptional()
  @Type(() => DashboardSort)
  @ValidateNested({ each: true })
  sort?: DashboardSort;

  @Type(() => DashboardPagination)
  @ValidateNested({ each: true })
  pagination: DashboardPagination = new DashboardPagination({page: 1, pagesize: 20});
}

class CreateDashboardRequest {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsObject()
  @JSONSchema({
    additionalProperties: { type: 'string' },
  })
  content: Record<string, unknown>;
}

class DashboardIDRequest {
  @IsUUID()
  id: string;
}

class DashboardUpdateRequest extends CreateDashboardRequest{
  @IsUUID()
  id: string;
}

const router = express.Router();
router.post('/list', validate(ListDashboardRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const {filter, pagination, sort} = req.body;
    const result = await dashboardService.list(filter, pagination, sort);
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/create', validate(CreateDashboardRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const name = req.body.name;
    const content = req.body.content;
    const result = await dashboardService.create(name, content);
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/details', validate(DashboardIDRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const id = req.body.id;
    const result = await dashboardService.get(id);
    if (!result) {
      throw new ApiError(NOT_FOUND);
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
})
 
router.post('/update', validate(DashboardUpdateRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const { id, name, content } = req.body;
    const result = await dashboardService.update(id, name, content);
    if (!result) {
      throw new ApiError(NOT_FOUND);
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/delete', validate(DashboardIDRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const id = req.body.id;
    const result = await dashboardService.delete(id);
    if (!result) {
      throw new ApiError(NOT_FOUND);
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
})

export default router;