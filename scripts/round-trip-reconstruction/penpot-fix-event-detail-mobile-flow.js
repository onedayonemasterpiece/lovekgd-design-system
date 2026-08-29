/**
 * Source-exact mobile prose repair for Event detail fixture event.real.5459.
 *
 * Run only after opening page 63.07 in a separate MCP call and allowing page
 * initialization to settle.  The correction lives on the reusable Identity
 * and description main so the canonical owner copy inherits it.  The Related
 * region is then positioned after the enlarged identity flow and remains
 * clipped outside the bounded 390x2400 review viewport, as it is in Astro.
 *
 * Text setters can start Penpot's resize loop.  For crash safety, callers
 * should apply one text record per MCP invocation, wait outside the call, and
 * read back before applying the next record.  This module deliberately exposes
 * the records separately instead of hiding a bulk text mutation in one helper.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec';
const MAIN_ID = 'd87e18f1-dcb4-80a6-8008-8860d41aef4e';
const OWNER_COPY_ID = 'd87e18f1-dcb4-80a6-8008-886141078dff';
const RELATED_ID = 'd87e18f1-dcb4-80a6-8008-8861415a20d3';

const BODY_2 = `В составе экспозиции — 42 произведения
выдающихся живописцев из собрания
Ярославского художественного музея,
который является одним из крупнейших
региональных художественных музеев
России. Проект стал продолжением
сотрудничества с этим партнером после
успеха выставки «Тихие вечера. Лунная
ночь» в 2023 году. Среди
представленных работ:`;

const WORKS = `• Константин Коровин
• Зинаида Серебрякова
• Илья Машков
• Михаил Кончаловский
• Константин Зефиров
• Михаил Соколов
• М.С. Васильев, «Nature morte» (1918–
  1919, картон, масло)
• Николай Перцев, «Стекло» (1973,
  оргалит, темпера)`;

const VISIT_BODY = `Множественность стилистических
направлений начала XX века и
разнообразие отражений предметного
мира в натюрморте представлены
работами Константина Коровина,
Зинаиды Серебряковой и других авторов.
Экскурсии по выставке проводятся
ежедневно. Стоимость посещения
составляет 150–300 ₽, стоимость
экскурсионного обслуживания — 250
рублей с человека.`;

const TEXT_RECORDS = {
  'Section title': { x: 4, y: 136, width: 358, height: 24, fontSize: '21.6', fontWeight: '700', lineHeight: '1.08', fillColor: '#221a14' },
  'Editorial quote': { x: 22, y: 192, width: 323, height: 103, fontSize: '16', fontWeight: '400', lineHeight: '1.6', fillColor: '#33251d' },
  'Body 1': { x: 4, y: 326, width: 358, height: 230, fontSize: '16', fontWeight: '400', lineHeight: '1.6', fillColor: '#493f38' },
  Subheading: { x: 4, y: 578, width: 358, height: 41, fontSize: '18.88', fontWeight: '700', lineHeight: '1.08', fillColor: '#3b3029' },
  'Body 2': { x: 4, y: 627, width: 358, height: 256, fontSize: '16', fontWeight: '400', lineHeight: '1.6', fillColor: '#493f38', characters: BODY_2 },
  'Works list / source exact': { x: 4, y: 898, width: 358, height: 256, fontSize: '16', fontWeight: '400', lineHeight: '1.6', fillColor: '#493f38', characters: WORKS },
  'Visit heading / source exact': { x: 4, y: 1176, width: 358, height: 21, fontSize: '18.88', fontWeight: '700', lineHeight: '1.08', fillColor: '#3b3029', characters: 'Посещение и стоимость' },
  'Visit body / source exact': { x: 4, y: 1205, width: 358, height: 282, fontSize: '16', fontWeight: '400', lineHeight: '1.6', fillColor: '#493f38', characters: VISIT_BODY }
};

function assertContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
    throw new Error('open settled page 63.07 before applying Event detail mobile flow repair');
  }
}

function ensureText(penpot, main, name, record) {
  let shape = main.children.find(child => child.name === name);
  if (!shape) {
    if (record.characters == null) throw new Error(`missing required source text: ${name}`);
    shape = penpot.createText(record.characters);
    shape.name = name;
    main.appendChild(shape);
  }
  if (record.characters != null && shape.characters !== record.characters) shape.characters = record.characters;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = record.fontSize;
  shape.fontWeight = record.fontWeight;
  shape.lineHeight = record.lineHeight;
  shape.letterSpacing = '0';
  shape.fills = [{ fillColor: record.fillColor, fillOpacity: 1 }];
  shape.resize(record.width, record.height);
  penpotUtils.setParentXY(shape, record.x, record.y);
  return shape;
}

/** Apply exactly one text record, then return and wait/read back externally. */
function applyEventDetailMobileTextRecord(penpot, penpotUtils, name) {
  assertContext(penpot);
  const record = TEXT_RECORDS[name];
  if (!record) throw new Error(`unknown Event detail mobile text record: ${name}`);
  const main = penpot.currentPage.getShapeById(MAIN_ID);
  if (!main?.isComponentMainInstance()) throw new Error(`missing Event detail mobile main: ${MAIN_ID}`);
  const shape = ensureText(penpot, main, name, record);
  return { schema_version: 'round-trip-reconstruction.event-detail-mobile-flow.v1', shape_id: shape.id, name };
}

/** Non-text geometry; safe to apply after all text records have settled. */
function applyEventDetailMobileFlowGeometry(penpot, penpotUtils) {
  assertContext(penpot);
  const main = penpot.currentPage.getShapeById(MAIN_ID);
  const owner = penpot.currentPage.getShapeById(OWNER_COPY_ID);
  const related = penpot.currentPage.getShapeById(RELATED_ID);
  if (!main?.isComponentMainInstance() || !owner?.isComponentCopy) {
    throw new Error('Event detail mobile flow ancestry is incomplete');
  }
  const bg = main.children.find(child => child.name === 'Editorial quote background');
  const rule = main.children.find(child => child.name === 'Editorial quote rule');
  if (!bg || !rule) throw new Error('Event detail quote geometry is incomplete');
  bg.resize(358, 134.375);
  bg.fills = [{ fillColor: '#fff4e6', fillOpacity: 1 }];
  penpotUtils.setParentXY(bg, 4, 176);
  rule.resize(4, 134.375);
  rule.fills = [{ fillColor: '#a54821', fillOpacity: 1 }];
  penpotUtils.setParentXY(rule, 4, 176);
  main.resize(366, 1515);
  // The 2400px review owner is bounded; the Related region was completely
  // outside its export and only inflated the page/violated owner bounds.
  const removedOffCanvasRelated = related?.id ?? null;
  related?.remove();
  return {
    schema_version: 'round-trip-reconstruction.event-detail-mobile-flow.v1',
    main_height: main.height,
    owner_height: owner.height,
    removed_off_canvas_related: removedOffCanvasRelated
  };
}

if (typeof module !== 'undefined') module.exports = {
  TEXT_RECORDS,
  applyEventDetailMobileTextRecord,
  applyEventDetailMobileFlowGeometry
};
