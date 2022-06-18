/** @param {NS} ns */
async function scan(ns, server, result = []) {
	if (result.indexOf(server) > -1) return result;

	let branches = await ns.scan(server);
	result.push(server);

	for (let i = 0; i < branches.length; i++) {
		await scan(ns, branches[i], result);
	}

	return result;
};

/** @param {NS} ns */
async function hack(ns, server) {

	if (ns.hasRootAccess(server)) return true;
	if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) return false;

	let ports = ns.getServerNumPortsRequired(server);
	ns.print(`Hacking ${server}`)

	switch (true) {
		case ports >= 5:
			if (ns.fileExists("SQLInject.exe", "home")) {
				await ns.sqlinject(server);
			};
		case ports >= 4:
			if (ns.fileExists("BruteSSH.exe", "home")) {
				await ns.httpworm(server);
			};
		case ports >= 3:
			if (ns.fileExists("relaySMTP.exe", "home")) {
				await ns.relaysmtp(server);
			};
		case ports >= 2:
			if (ns.fileExists("FTPCrack.exe", "home")) {
				await ns.ftpcrack(server);
			};
		case ports >= 1:
			if (ns.fileExists("BruteSSH.exe", "home")) {
				await ns.brutessh(server);
			};
		case ports >= 0:
			if (ns.getServer(server).openPortCount >= ports) {
				await ns.nuke(server);
			}
	}

	if (ns.hasRootAccess(server)) return true;
	return false;
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");

	let servers = await scan(ns, "home");


	let controlled = [];

	for (let i = 0; i < servers.length; i++) {
		if (await hack(ns, servers[i])) {
			controlled.push(servers[i]);
		}
	}

	ns.print(`Controlled servers: ${controlled}`);

}