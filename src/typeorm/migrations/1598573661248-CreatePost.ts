import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
                        length: '100',
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
                        name: 'category',
                        type: 'varchar',
                        length: '30',
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
                        length: '50',
                        isNullable: false
                    },
                    {
                        name: 'local',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'requirements',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'experienceLevel',
                        type: 'varchar',
                        length: '60',
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
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                        isNullable: false,
                    }
                ]
            })
        )

        await queryRunner.createForeignKey('posts', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('posts')
    }
}
