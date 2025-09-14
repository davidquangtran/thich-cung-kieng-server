import { AbstractEntity } from 'src/common/base/entity.base';
import { DifficultyLevel } from 'src/common/enums/ritual.enum';
import { RitualMedia } from 'src/modules/ritual-media/entities/ritual-media.entity';
import { RitualTag } from 'src/modules/ritual-tag/entities/ritual-tag.entity';
import { Offering } from 'src/modules/offering/entities/offering.entity';
import { Prayer } from 'src/modules/prayer/entities/prayer.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { RitualReview } from 'src/modules/ritual-review/entities/ritual-review.entity';
import { RitualCategory } from 'src/modules/ritual-category/entities/ritual-category.entity';
import { UserFavoriteRitual } from 'src/modules/user-favorite-ritual/entities/user-favorite-ritual.entity';

@Entity({ name: 'rituals' })
export class Ritual extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ name: 'time_of_execution', nullable: true })
  timeOfExecution: number;

  @Column({ name: 'date_lunar', type: 'varchar' })
  dateLunar: string;

  @Column({ name: 'date_solar', type: 'date' })
  dateSolar: string;

  @Column({
    name: 'difficulty_level',
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.EASY,
  })
  difficultyLevel: DifficultyLevel;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ name: 'is_hot', default: false })
  isHot: boolean;

  @Column({ name: 'ritual_category_id', nullable: true })
  ritualCategoryId: string;

  @OneToMany(() => RitualMedia, (ritualMedia) => ritualMedia.ritual, {
    cascade: true,
  })
  ritualMedias: RitualMedia[];

  @OneToMany(() => RitualTag, (ritualTag) => ritualTag.ritual, {
    cascade: true,
  })
  ritualTags: RitualTag[];

  @OneToMany(() => Offering, (offering) => offering.ritual, { cascade: true })
  offerings: Offering[];

  @OneToMany(() => Prayer, (prayer) => prayer.ritual, { cascade: true })
  prayers: Prayer[];

  @OneToMany(() => RitualReview, (ritualReview) => ritualReview.ritual, {
    cascade: true,
  })
  ritualReviews: RitualReview[];

  @ManyToOne(() => RitualCategory, (ritualCategory) => ritualCategory.rituals)
  ritualCategory: RitualCategory;

  @OneToMany(() => UserFavoriteRitual, (ufr) => ufr.ritual)
  favoriteByUsers: UserFavoriteRitual[];

  constructor(partial: Partial<Ritual>) {
    super();
    Object.assign(this, partial);
  }
}
