import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1598403080638 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'profileImage',
                        type: 'text',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '50',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '30',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '200',
                        isNullable: false
                    },
                    {
                        name: 'accountType',
                        type: 'varchar',
                        length: '8',
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
        await queryRunner.dropTable('users')
    }

}
