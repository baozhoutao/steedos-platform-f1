"use strict";

"use strict";
import { ActionHandlers, started, stopped } from './actionsHandler';
import * as _ from 'underscore';
const SERVICE_NAME = 'metadata';
module.exports = {
	name: SERVICE_NAME,
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {

	},
	async started() {
		await started(this.broker)
	},
	/**
	   * Methods
	   */
	methods: {
		refreshServiceMetadatas:async function (ctx) {
			return await ActionHandlers.refreshServiceMetadatas(ctx)
		}
	},

	events: {
		"$services.changed"(ctx) {
			this.refreshServiceMetadatas(ctx);
		}
	},
	/**
	   * Actions
	   */
	actions: {
		get: {
			async handler(ctx) {
				return await ActionHandlers.get(ctx);
			}
		},
		filter: {
			async handler(ctx) {
				return await ActionHandlers.filter(ctx);
			}
		},
		add: {
			async handler(ctx) {
				return await ActionHandlers.add(ctx);
			}
		},
		addServiceMetadata: {
			async handler(ctx) {
				return await ActionHandlers.addServiceMetadata(ctx);
			}
		},
		delete: {
			async handler(ctx) {
				return await ActionHandlers.delete(ctx);
			}
		},
		refreshServiceMetadatas: {
			params: {
                offlinePackageServices: { type: "array", items: "string" },
            },
			async handler(ctx) {
				return await ActionHandlers.refreshServiceMetadatas(ctx);
			}
		},
		getServiceMetadatas: {
			async handler(ctx) {
				return await ActionHandlers.getServiceMetadatas(ctx);
			}
		},
		getServiceMetadata: {
			params: {
				serviceName: { type: "string"},
				metadataType: { type: "string"},
				metadataApiName: { type: "string"},
			},
			async handler(ctx) {
				return await ActionHandlers.getServiceMetadata(ctx);
			}
		}
	},
	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		await stopped(this.broker)
	}
}
