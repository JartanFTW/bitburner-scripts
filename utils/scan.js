/** @param {import("..").NS} ns */
export async function scan(ns, server, result = []) {
	if (result.indexOf(server) > -1) return result;

	let branches = await ns.scan(server);
	result.push(server);

	for (let i = 0; i < branches.length; i++) {
		await scan(ns, branches[i], result);
	}

	return result;
};