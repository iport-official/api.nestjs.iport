import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePost1598573661248 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'posts',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'image',
                        type: 'text',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'recomendation',
                        type: 'integer',
                        default: 0
                    },
                    {
                        name: 'contact',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'salary',
                        type: 'decimal',
                        default: 0
                    },
                    {
                        name: 'post',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'local',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'requirements',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'experienceLevel',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'vacancyDescription',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'createAt',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updateAt',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('posts')
    }
}
