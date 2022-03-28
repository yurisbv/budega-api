import { Module } from '@nestjs/common';

import { MongoClient, Db, Logger } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          Logger.setLevel('debug');
          const connectString = `mongodb://${process.env.DATABASE_USER}:${
            process.env.DATABASE_PASSWORD
          }@${process.env.DATABASE_URL}:${
            parseInt(process.env.DATABASE_PORT, 10) || 27017
          }/${process.env.DATABASE_NAME}`;
          console.debug(connectString);
          const client = await MongoClient.connect(connectString, {});
          return client.db();
          // await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
