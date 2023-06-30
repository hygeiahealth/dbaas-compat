/*
	DBaaS-Compatible
	NodeJS client
	2023-06-27 gbk

	Targets DBaaS API v1
*/

const fetch = require('node-fetch-retry');
var APIROOT = '';

const log4js = require('log4js');
var logger = log4js.getLogger('DBaaS:Compat');
const esc = require('url-escape-tag');

function Configure(root) {
	APIROOT = root;
}

async function DBaaSCompatRequest(Path) {

	try {

		let error = false;
		// 2020-11-23; use node-fetch-retry
		let res = await fetch(APIROOT+Path, {
			method: 'GET',
			retry: 3,
			pause: 1000,
			callback: retry => { logger.warn(retry) }
		}).catch(e => {
			logger.error(e);
			error = true;
		});

		if(error) return null;

		return await res.json();

	} catch(e) {
		logger.error(e);
		return null;
	}
}

async function GetObject(ObjectType,Version,Key,Params={}) {
	return await DBaaSCompatRequest(esc`Compat/${ObjectType}/${Version}/${Key}?${new URLSearchParams(Params).toString()}`);
}

async function CustomFieldSO(SOKey, Version='v0100') {
	return await GetObject('CustomField', Version, SOKey, { QueryName: 'SalesOrder' });
}
async function CustomFieldPt(PtKey, Version='v0100') {
	return await GetObject('CustomField', Version, PtKey, { QueryName: 'Patient' });
}

async function SalesOrder(SOKey, Version='v0100-2008') {
	return await GetObject('SalesOrder', Version, SOKey);
}


module.exports = {
	Configure,
	CustomFieldSO,
	CustomFieldPt,
	SalesOrder
};

