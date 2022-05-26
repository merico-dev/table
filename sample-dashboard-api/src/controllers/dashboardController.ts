import { IsObject, Length, IsString, IsOptional, IsIn, ValidateNested, IsUUID, IsBoolean } from 'class-validator';
import express from 'express';
import { DashboardService } from '../services/app/dashboard_service';
import { validate } from '../middlewares/validation'
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';
import { FilterRequest, PaginationRequest, SortRequest } from './base.type';

export class DashboardFilter extends FilterRequest {
  @IsOptional()
  @IsString()
  @IsIn(['', 'ALL', 'REMOVED'])
  selection?: string;
}

export class DashboardSort implements SortRequest {
  @IsIn(['create_time', 'name'])
  field: string;

  @IsIn(['ASC', 'DESC',])
  order: 'ASC' | 'DESC';

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class DashboardListRequest {
  @IsOptional()
  @Type(() => DashboardFilter)
  @ValidateNested({ each: true })
  filter?: DashboardFilter;

  @Type(() => DashboardSort)
  @ValidateNested({ each: true })
  sort: DashboardSort = new DashboardSort({ field: 'create_time', order: 'ASC' });

  @Type(() => PaginationRequest)
  @ValidateNested({ each: true })
  pagination: PaginationRequest = new PaginationRequest({ page: 1, pagesize: 20 });
}

export class DashboardCreateRequest {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsObject()
  @JSONSchema({
    additionalProperties: { type: 'string' },
  })
  content: Record<string, unknown>;
}

export class DashboardIDRequest {
  @IsUUID()
  id: string;
}

export class DashboardUpdateRequest extends DashboardIDRequest{
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name?: string;

  @IsOptional()
  @IsObject()
  @JSONSchema({
    additionalProperties: { type: 'string' },
  })
  content?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  is_removed?: boolean;
}

const router = express.Router();
router.post('/list', validate(DashboardListRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const data: DashboardListRequest = req.body;
    const result = await dashboardService.list(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/create', validate(DashboardCreateRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const data: DashboardCreateRequest = req.body;
    const result = await dashboardService.create(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/details', validate(DashboardIDRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const data: DashboardIDRequest = req.body;
    const result = await dashboardService.get(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
})
 
router.post('/update', validate(DashboardUpdateRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const data: DashboardUpdateRequest = req.body;
    const result = await dashboardService.update(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/delete', validate(DashboardIDRequest), async (req: express.Request, res, next) => {
  try {
    const dashboardService = new DashboardService();
    const data: DashboardIDRequest = req.body;
    const result = await dashboardService.delete(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
})

export default router;