// import { Provider, ProviderOptions, util } from "klasa";
// import { Init } from "../../lib";
// import Client, { Redis } from "ioredis";

// @Init<ProviderOptions>({ name: "redis" })
// export default class RedisProvider extends Provider {
//   public db: Redis

// 	constructor(...args) {
// 		super(...args);

// 		this.db = new Client({
//       host: "localhost",
//       db: 0,
//       port: 6379
//     });

//  		this.db.on('ready', () => this.client.emit('debug', 'Redis initialized.'))
// 			.on('serverReconnect', server => this.client.emit('warn', `Redis server: ${server.host.string} is reconnecting.`))
// 			.on('error', err => this.client.emit('error', err));
// 	}

// 	get(table: string, id: string) {
// 		return this.db.get(`${table}-${id}`);
// 	}

// 	has(table: string, id: string) {
// 		return this.db.(id);
// 	}

// 	getRandom(table: string) {
// 		return this.db.randomkey();
// 	}

// 	create(table, id, data) {
// 		return this.db.table(table).setJson(id, data);
// 	}

// 	async update(table, id, data) {
// 		const existent = await this.get(table, id);
// 		return this.create(table, id, util.mergeObjects(existent || { id }, this.parseUpdateInput(data)));
// 	}

// 	replace(...args) {
// 		return this.set(...args);
// 	}

// 	delete(table, id) {
// 		return this.db.table(table).del(id);
// 	}

// };