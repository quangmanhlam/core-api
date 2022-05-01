import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {EventEmitterModule} from '@nestjs/event-emitter';
const MongooseAutoIncrement = require('mongoose-auto-increment');

import {configs} from "./configs";
import {MainService} from "./main.service";
import {MainController} from "./main.controller";
import {
  ApmModule,
  AuthModule,
  MigrationModule,
  UserModule,
} from "./modules";

@Module({
  imports: [
    // import mongoose module
    MongooseModule.forRootAsync({
      useFactory: () => {
        const db = configs.db;
        console.log(configs.db);

        let uri = db.uri || null;
        if (!uri) {
          uri = "mongodb://";

          if (db.username && db.pass) {
            uri += `${db.username}:${db.pass}@`;
          }
          // only using in version less than 6.0
          // uri += `${db.host}:${db.port}/${db.name}?poolSize=${db.poolSize}&retryWrites=true`;
          uri += `${db.host}:${db.port}/${db.name}`;
          if (db.replicaSet) uri += `&replicaSet=${db.replicaSet}`;
        }
        console.log(uri);
        return {
          uri,
          // no longer necessary
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // useCreateIndex: true,
          // useFindAndModify: false,
          // poolSize: db.poolSize || 10,
          // replicaSet: db.replicaSet || null,
          // retryWrites: true,
          connectionFactory: (connection: any) => {
            // Throw an error if the connection fails
            connection.on('error', function (err) {
              console.log('MongoDB connect error');
              console.log(err);
              process.exit(1);
            });

            connection.on('open', function () {
              console.log("MongoDB connected");
            });

            // add plugin mongoose paginate, auto increment
            // initialize
            MongooseAutoIncrement.initialize(connection);
            return connection;
          }
        };
      }
    }),
    // base module
    EventEmitterModule.forRoot(),
    ApmModule,

    // feature module
    AuthModule,
    UserModule,
    MigrationModule,
  ],
  controllers: [MainController],
  providers: [MainService]
})
export class MainModule {
}
