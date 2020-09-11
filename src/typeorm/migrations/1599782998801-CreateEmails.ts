import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEmails1599782998801 implements MigrationInterface {

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
                        name: 'email',
                        length: '100',
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
        queryRunner.dropTable('emails')
    }

}
