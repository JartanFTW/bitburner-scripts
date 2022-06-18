async function scan_tree(ns, start) {
	let res = {};

	let scan_res = await ns.scan(start);
	let i = 1; 
	if (start == "home") i--;
	for (; i < scan_res.length; i++) {
		let branch = await scan_tree(ns, scan_res[i]);
		res[scan_res[i]] = branch;
	}
	return res;
}

/** @param {NS} ns */
async function hack_tree(ns, tree, ports) {
	if (tree == null) return;

	let keys = Object.keys(tree);
	let len = keys.length;

	for (var i = 0; i < len; i++) {
		if (!(ns.hasRootAccess(keys[i])) && (ns.getServerNumPortsRequired(keys[i]) <= ports)) {
			let ports = ns.getServerNumPortsRequired(keys[i]);
			let server = keys[i]
			ns.print(`Hacking ${keys[i]}`)
			if (ports >= 5) {
				await ns.sqlinject(server);
			} if (ports >= 4) {
				await ns.httpworm(server);
			} if (ports >= 3) {
				await ns.relaysmtp(server);
			} if (ports >= 2) {
				await ns.ftpcrack(server);
			} if (ports >= 1) {
				await ns.brutessh(server);
			} 
			await ns.nuke(server);
		}
		await hack_tree(ns, tree[i], ports);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("scan");
	ns.disableLog("hasRootAccess")
	ns.disableLog("getServerNumPortsRequired")

	let tree = await scan_tree(ns, "home");
	ns.print(tree);

	await hack_tree(ns, tree, 0);

}