/** Export both accepted EventCard roots as directly decodable PNG payloads. */
if(!storage.g19EventCard8006) throw new Error('G19_EVENTCARD_8006_API_NOT_INSTALLED');
return await storage.g19EventCard8006.exportRoots();
