// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PDFDocumen... Remove this comment to see the full error message
const { PDFDocument, rgb } = require('pdf-lib');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'readFile'.
const { readFile } = require('fs/promises');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'pdfLibFont... Remove this comment to see the full error message
const pdfLibFontkit = require('@pdf-lib/fontkit');
const MAX_SESSION_DETAIL_WIDTH = 155;
const SESSION_DETAIL_FONT_SIZE = 7;
const SESSION_DETAIL_LINE_HEIGHT = 8;

async function getSupervisorKitPdfBuffer({
  sessionForSupervisorKit,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
  dirname = __dirname,
  fontkit = pdfLibFontkit,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  creationDate = new Date()
}: any = {}) {
  const fileBuffer = await readFile(`${dirname}/files/kit-surveillant_template.pdf`);

  const pdfDoc = await PDFDocument.load(fileBuffer);

  pdfDoc.setCreationDate(creationDate);
  pdfDoc.setModificationDate(creationDate);

  pdfDoc.registerFontkit(fontkit);

  const fontFile = await readFile(`${dirname}/files/Roboto-Medium.ttf`);
  const robotFont = await pdfDoc.embedFont(fontFile, { subset: true, customName: 'Roboto-Medium.ttf' });

  const [page] = pdfDoc.getPages();

  _drawSessionDate(sessionForSupervisorKit, page, robotFont);
  _drawSessionStartTime(sessionForSupervisorKit, page, robotFont);
  _drawSessionAddress(sessionForSupervisorKit, page, robotFont);
  _drawSessionExaminer(sessionForSupervisorKit, page, robotFont);
  _drawSessionRoom(sessionForSupervisorKit, page, robotFont);
  _drawSessionId(sessionForSupervisorKit, page, robotFont);
  _drawSupervisorPassword(sessionForSupervisorKit, page, robotFont);
  _drawAccessCode(sessionForSupervisorKit, page, robotFont);

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  const fileName = `kit-surveillant-${sessionForSupervisorKit.id}.pdf`;

  return {
    buffer,
    fileName,
  };
}

function _drawSessionDate(sessionForSupervisorKit: any, page: any, font: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const date = new Date(sessionForSupervisorKit.date);
  const day = date.getDate();
  const year = date.getFullYear();
  const options = { month: 'short' };
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Intl'.
  const month = new Intl.DateTimeFormat('fr-FR', options).format(date);

  const fullDate = day + ' ' + month + ' ' + year;
  page.drawText(fullDate, {
    x: 85,
    y: 646,
    size: SESSION_DETAIL_FONT_SIZE,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawSessionStartTime(sessionForSupervisorKit: any, page: any, font: any) {
  const [hours, minutes] = sessionForSupervisorKit.time.split(':');
  const hour = `${hours}h${minutes}`;
  page.drawText(hour, {
    x: 182,
    y: 646,
    size: SESSION_DETAIL_FONT_SIZE,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawSessionAddress(sessionForSupervisorKit: any, page: any, font: any) {
  const addressArray = _toArrayOfFixedWidthConservingWords(
    sessionForSupervisorKit.address,
    font,
    MAX_SESSION_DETAIL_WIDTH
  );
  addressArray.forEach((address: any, index: any) => {
    page.drawText(address, {
      x: 60,
      y: 616 - index * SESSION_DETAIL_LINE_HEIGHT,
      size: SESSION_DETAIL_FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function _drawSessionRoom(sessionForSupervisorKit: any, page: any, font: any) {
  const roomArray = _toArrayOfFixedWidthConservingWords(sessionForSupervisorKit.room, font, MAX_SESSION_DETAIL_WIDTH);
  roomArray.forEach((room: any, index: any) => {
    page.drawText(room, {
      x: 60,
      y: 584 - index * SESSION_DETAIL_LINE_HEIGHT,
      size: SESSION_DETAIL_FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function _drawSessionExaminer(sessionForSupervisorKit: any, page: any, font: any) {
  const examinerArray = _toArrayOfFixedWidthConservingWords(
    sessionForSupervisorKit.examiner,
    font,
    MAX_SESSION_DETAIL_WIDTH
  );
  examinerArray.forEach((examiner: any, index: any) => {
    page.drawText(examiner, {
      x: 60,
      y: 549 - index * SESSION_DETAIL_LINE_HEIGHT,
      size: SESSION_DETAIL_FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function _drawSessionId(sessionForSupervisorKit: any, page: any, font: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'String'.
  const sessionId = String(sessionForSupervisorKit.id);
  const textWidth = font.widthOfTextAtSize(sessionId, 10);
  page.drawText(sessionId, {
    x: 277 - textWidth / 2,
    y: 594,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawSupervisorPassword(sessionForSupervisorKit: any, page: any, font: any) {
  const supervisorPassword = `C-${sessionForSupervisorKit.supervisorPassword}`;
  const textWidth = font.widthOfTextAtSize(supervisorPassword, 10);
  page.drawText(supervisorPassword, {
    x: 383 - textWidth / 2,
    y: 594,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawAccessCode(sessionForSupervisorKit: any, page: any, font: any) {
  const accessCode = sessionForSupervisorKit.accessCode;
  const textWidth = font.widthOfTextAtSize(accessCode, 10);
  page.drawText(accessCode, {
    x: 486 - textWidth / 2,
    y: 594,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function _toArrayOfFixedWidthConservingWords(str: any, font: any, maxWidth: any) {
  const result: any = [];
  const words = str.split(' ');
  let index = 0;
  words.forEach((word: any) => {
    if (!result[index]) {
      result[index] = '';
    }
    if (font.widthOfTextAtSize(`${result[index]} ${word}`, 7) <= maxWidth) {
      result[index] += `${word} `;
    } else {
      index++;
      result[index] = `${word} `;
    }
  });
  return result.map((str: any) => str.trim());
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getSupervisorKitPdfBuffer,
};
