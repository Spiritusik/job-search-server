import { Request } from 'express';

export type BodyOnlyRequest<T> = Request<{}, any, T, any>;