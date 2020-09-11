import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTelephones1599653773196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'telephones',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'telephone',
                        length: '50',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                        isNullable: false,
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
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('telephones')
    }

}
