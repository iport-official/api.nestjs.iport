import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { isNull } from "util";

export class CreateEmails1599653783631 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'emails',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'emailAddress',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
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
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('emails')
    }

}
