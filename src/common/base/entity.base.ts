import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @ApiProperty({
    description: 'Thời gian tạo bản ghi',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'Thời gian tạo bản ghi',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'ID người tạo bản ghi',
    example: 'uuid-string',
    nullable: true,
  })
  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
    comment: 'ID người dùng tạo bản ghi',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Thời gian cập nhật bản ghi lần cuối',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: 'Thời gian cập nhật bản ghi lần cuối',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID người cập nhật bản ghi lần cuối',
    example: 'uuid-string',
    nullable: true,
  })
  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
    comment: 'ID người dùng cập nhật bản ghi lần cuối',
  })
  updatedBy: string;

  @ApiProperty({
    description: 'Thời gian xóa bản ghi (soft delete)',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Thời gian xóa bản ghi (soft delete)',
  })
  @Exclude()
  deletedAt: Date;
}
