const objectql = require('@steedos/objectql');
const _ = require('underscore');
module.exports = {
    listenTo: 'base',
    beforeInsert: async function () {
        const { doc, userId } = this;
        doc.created = new Date();
        doc.modified = new Date();
        if (userId) {
            if (!doc.owner) {
                doc.owner = userId;
            }
            if (doc.owner === '{userId}') {
                doc.owner = userId;
            }
            doc.created_by = userId;
            doc.modified_by = userId;
        }
        var extras = ["spaces", "company", "organizations", "users", "space_users"];
        if (extras.indexOf(this.object_name) < 0 && doc.space) {
            /* company_ids/company_id默认值逻辑*/
            if (!doc.company_id || !doc.company_ids) {
                var su;
                if (userId) {
                    const spaceUsers = await objectql.getObject("space_users").find({ filters: [['space', '=', doc.space], ['user', '=', userId]], fields: ['company_id'] });
                    su = spaceUsers.length > 0 ? spaceUsers[0] : null
                }
                if (!doc.company_id) {
                    if (doc.company_ids && doc.company_ids.length) {
                        /* 如果用户在界面上指定了company_ids，则取第一个值 */
                        doc.company_id = doc.company_ids[0];
                    }
                    else if (su && su.company_id) {
                        doc.company_id = su.company_id;
                    }
                }
                if (!doc.company_ids) {
                    if (doc.company_id) {
                        /* 如果用户在界面上指定了company_id，则取其值输入 */
                        doc.company_ids = [doc.company_id];
                    }
                    else if (su && su.company_id) {
                        doc.company_ids = [su.company_id];
                    }
                }
            }
        }
    },
    beforeUpdate: async function () {
        const { doc, userId } = this;
        doc.modified = new Date();
        if (userId) {
            doc.modified_by = userId;
        }
        var extras = ["spaces", "company", "organizations", "users", "space_users"];
        if (extras.indexOf(this.object_name) < 0) {
            /* company_ids/company_id级联修改逻辑*/
            if (_.has(doc, "company_ids")) {
                /*
                    原则上应该将 company_ids 设置为可编辑，company_id 设置为只读。
                    当 company_ids 可编辑时，修改 company_ids 同时更新 company_id = company_ids[0]
                */
                var firstCompanyId = doc.company_ids ? doc.company_ids[0] : null;
                if (firstCompanyId) {
                    doc.company_id = firstCompanyId;
                }
                else {
                    doc.company_id = null;
                }
            }
            else if (_.has(doc, "company_id")) {
                /*
                    考虑到兼容老项目，允许将 company_id 设置为可编辑，此时 company_ids 必须只读。
                    当 company_id 可编辑时，修改 company_id 同时更新 company_ids = [company_id]
                */
                if (doc.company_id) {
                    doc.company_ids = [doc.company_id];
                }
                else {
                    doc.company_ids = null;
                }
            }
        }
    }
}