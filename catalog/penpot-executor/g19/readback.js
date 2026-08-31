/** Run after run-materialization.js in the same Penpot plugin session. */
if(!storage.g19EventCard8006) throw new Error('G19_EVENTCARD_8006_API_NOT_INSTALLED');
return storage.g19EventCard8006.readback();
