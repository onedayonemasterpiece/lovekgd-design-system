/** Reproduce the OV-41/43 source-exact full-owner projection from exact bytes. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c8e21990e';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880c9f323d8b';
const MOBILE_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880ca6c8b403';

function installFestivalsOv4143Materializer(penpot, penpotUtils, storage) {
  const byId = (id) => penpot.library.local.components.find((component) => component.id === id);
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    shape.resize(width, height); penpotUtils.setParentXY(shape, x, y); return shape;
  };
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error(`open settled Festivals page ${PAGE_ID}`);
  };
  const imageRect = (parent, name, media, width, height) => {
    const shape = penpot.createRectangle(); shape.name = name;
    shape.fills = [{ fillImage: media, fillOpacity: 1 }]; shape.strokes = [];
    parent.appendChild(shape); return place(shape, 0, 0, width, height);
  };

  async function repairOwners(desktopBytes, mobileBytes) {
    assertContext();
    if (!(desktopBytes instanceof Uint8Array) || !(mobileBytes instanceof Uint8Array)) throw new Error('supply exact JPEG Uint8Array evidence for both owners');
    const [desktopMedia, mobileMedia] = await Promise.all([
      penpot.uploadMediaData('OV41 Festivals desktop full Astro source exact', desktopBytes, 'image/jpeg'),
      penpot.uploadMediaData('OV41 Festivals mobile full Astro source exact', mobileBytes, 'image/jpeg'),
    ]);
    const desktop = byId(DESKTOP_OWNER_ID); const mobile = byId(MOBILE_OWNER_ID);
    if (!desktop || !mobile) throw new Error('Festival owner components missing');
    const block = penpot.history.undoBlockBegin();
    try {
      const d = desktop.mainInstance(); const m = mobile.mainInstance();
      [...d.children].forEach((child) => child.remove()); [...m.children].forEach((child) => child.remove());
      desktop.name = 'viewport=desktop;state=21-festivals;packed-rows · Astro source exact';
      d.name = 'Archetype / Festivals / viewport=desktop / full timeline / Astro source exact';
      place(d, 0, 0, 1280, 3604); imageRect(d, 'Astro source exact / 21 festivals / desktop / 1280x3604', desktopMedia, 1280, 3604);
      mobile.name = 'viewport=mobile;state=21-festivals;packed-rows · Astro source exact';
      m.name = 'Archetype / Festivals / viewport=mobile / full timeline / Astro source exact';
      place(m, 1320, 0, 390, 4091); imageRect(m, 'Astro source exact / 21 festivals / mobile / 390x4091', mobileMedia, 390, 4091);
    } finally { penpot.history.undoBlockFinish(block); }
    return readback();
  }

  async function readback() {
    assertContext();
    return {
      owners: [DESKTOP_OWNER_ID, MOBILE_OWNER_ID].map((id) => { const c = byId(id); const m = c.mainInstance(); return { id, name: c.name, main: m.id, size: [m.width, m.height], sourceImages: [...m.children].filter((s) => s.fills?.some((f) => f.fillImage)).length }; }),
      validation: await penpot.currentFile.validate(),
    };
  }
  storage.festivalsOv4143 = { repairOwners, readback };
  return { installed: true, methods: Object.keys(storage.festivalsOv4143) };
}
if (typeof module !== 'undefined') module.exports = { installFestivalsOv4143Materializer, constants: { FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, MOBILE_OWNER_ID } };
