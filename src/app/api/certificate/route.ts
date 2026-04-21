import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User, Chapter } from "@/models";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import crypto from "crypto";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check that user has completed all chapters
    const totalChapters = await Chapter.countDocuments();
    if (user.chaptersCompleted.length < totalChapters) {
      return Response.json(
        {
          error: "You must complete all chapters to earn a certificate",
          completed: user.chaptersCompleted.length,
          total: totalChapters,
        },
        { status: 403 }
      );
    }

    // Generate certificate ID if not already present
    if (!user.certificateId) {
      user.certificateId = crypto.randomUUID();
      await user.save();
    }

    // Create PDF - A4 landscape (842 x 595)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    // ── Colors ──
    const green = rgb(0.133, 0.545, 0.133);
    const darkGreen = rgb(0.067, 0.4, 0.067);
    const gold = rgb(0.831, 0.686, 0.216);
    const darkGray = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.6, 0.6, 0.6);
    const white = rgb(1, 1, 1);

    // ── Green header area ──
    page.drawRectangle({
      x: 0,
      y: height - 140,
      width,
      height: 140,
      color: green,
    });

    // ── Border ──
    const borderWidth = 3;
    const margin = 20;
    page.drawRectangle({
      x: margin,
      y: margin,
      width: width - 2 * margin,
      height: height - 2 * margin,
      borderColor: gold,
      borderWidth,
      color: undefined,
      opacity: 0,
    });

    // ── Inner border ──
    page.drawRectangle({
      x: margin + 8,
      y: margin + 8,
      width: width - 2 * (margin + 8),
      height: height - 2 * (margin + 8),
      borderColor: gold,
      borderWidth: 1,
      color: undefined,
      opacity: 0,
    });

    // ── FinoLingo branding in header ──
    const brandText = "FinoLingo";
    const brandSize = 36;
    const brandWidth = helveticaBold.widthOfTextAtSize(brandText, brandSize);
    page.drawText(brandText, {
      x: (width - brandWidth) / 2,
      y: height - 60,
      size: brandSize,
      font: helveticaBold,
      color: white,
    });

    const tagline = "Financial Literacy Platform";
    const taglineSize = 14;
    const taglineWidth = helvetica.widthOfTextAtSize(tagline, taglineSize);
    page.drawText(tagline, {
      x: (width - taglineWidth) / 2,
      y: height - 82,
      size: taglineSize,
      font: helvetica,
      color: white,
    });

    // ── Certificate of Completion ──
    const titleText = "Certificate of Completion";
    const titleSize = 32;
    const titleWidth = helveticaBold.widthOfTextAtSize(titleText, titleSize);
    page.drawText(titleText, {
      x: (width - titleWidth) / 2,
      y: height - 190,
      size: titleSize,
      font: helveticaBold,
      color: darkGreen,
    });

    // ── Decorative line ──
    page.drawLine({
      start: { x: width / 2 - 120, y: height - 200 },
      end: { x: width / 2 + 120, y: height - 200 },
      thickness: 2,
      color: gold,
    });

    // ── "This certifies that" ──
    const certifiesText = "This certifies that";
    const certifiesSize = 14;
    const certifiesWidth = timesItalic.widthOfTextAtSize(
      certifiesText,
      certifiesSize
    );
    page.drawText(certifiesText, {
      x: (width - certifiesWidth) / 2,
      y: height - 240,
      size: certifiesSize,
      font: timesItalic,
      color: lightGray,
    });

    // ── User name ──
    const nameText = user.name;
    const nameSize = 40;
    const nameWidth = helveticaBold.widthOfTextAtSize(nameText, nameSize);
    page.drawText(nameText, {
      x: (width - nameWidth) / 2,
      y: height - 290,
      size: nameSize,
      font: helveticaBold,
      color: darkGray,
    });

    // ── Underline beneath name ──
    page.drawLine({
      start: { x: width / 2 - 160, y: height - 298 },
      end: { x: width / 2 + 160, y: height - 298 },
      thickness: 1,
      color: gold,
    });

    // ── Description ──
    const descText =
      "has successfully completed the FinoLingo Financial Literacy Program";
    const descSize = 14;
    const descWidth = helvetica.widthOfTextAtSize(descText, descSize);
    page.drawText(descText, {
      x: (width - descWidth) / 2,
      y: height - 330,
      size: descSize,
      font: helvetica,
      color: darkGray,
    });

    const descText2 =
      "demonstrating proficiency in personal finance, investing, budgeting, and fraud awareness.";
    const descSize2 = 11;
    const descWidth2 = helvetica.widthOfTextAtSize(descText2, descSize2);
    page.drawText(descText2, {
      x: (width - descWidth2) / 2,
      y: height - 350,
      size: descSize2,
      font: helvetica,
      color: lightGray,
    });

    // ── Stats row ──
    const statsY = height - 410;
    const statsSize = 12;
    const statsLabelSize = 10;

    // Date
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateLabelText = "COMPLETION DATE";
    const dateValueWidth = helveticaBold.widthOfTextAtSize(dateStr, statsSize);
    const dateLabelWidth = helvetica.widthOfTextAtSize(
      dateLabelText,
      statsLabelSize
    );
    const dateX = width / 4;
    page.drawText(dateStr, {
      x: dateX - dateValueWidth / 2,
      y: statsY,
      size: statsSize,
      font: helveticaBold,
      color: darkGray,
    });
    page.drawText(dateLabelText, {
      x: dateX - dateLabelWidth / 2,
      y: statsY - 18,
      size: statsLabelSize,
      font: helvetica,
      color: lightGray,
    });

    // XP
    const xpStr = `${user.xp.toLocaleString()} XP`;
    const xpLabelText = "TOTAL XP EARNED";
    const xpValueWidth = helveticaBold.widthOfTextAtSize(xpStr, statsSize);
    const xpLabelWidth = helvetica.widthOfTextAtSize(
      xpLabelText,
      statsLabelSize
    );
    const xpX = width / 2;
    page.drawText(xpStr, {
      x: xpX - xpValueWidth / 2,
      y: statsY,
      size: statsSize,
      font: helveticaBold,
      color: darkGray,
    });
    page.drawText(xpLabelText, {
      x: xpX - xpLabelWidth / 2,
      y: statsY - 18,
      size: statsLabelSize,
      font: helvetica,
      color: lightGray,
    });

    // League
    const leagueStr = user.league;
    const leagueLabelText = "LEAGUE ACHIEVED";
    const leagueValueWidth = helveticaBold.widthOfTextAtSize(
      leagueStr,
      statsSize
    );
    const leagueLabelWidth = helvetica.widthOfTextAtSize(
      leagueLabelText,
      statsLabelSize
    );
    const leagueX = (3 * width) / 4;
    page.drawText(leagueStr, {
      x: leagueX - leagueValueWidth / 2,
      y: statsY,
      size: statsSize,
      font: helveticaBold,
      color: darkGray,
    });
    page.drawText(leagueLabelText, {
      x: leagueX - leagueLabelWidth / 2,
      y: statsY - 18,
      size: statsLabelSize,
      font: helvetica,
      color: lightGray,
    });

    // ── Certificate ID ──
    const certIdText = `Certificate ID: ${user.certificateId}`;
    const certIdSize = 8;
    const certIdWidth = helvetica.widthOfTextAtSize(certIdText, certIdSize);
    page.drawText(certIdText, {
      x: (width - certIdWidth) / 2,
      y: 40,
      size: certIdSize,
      font: helvetica,
      color: lightGray,
    });

    // Serialize to bytes
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="FinoLingo-Certificate-${user.name.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("GET /api/certificate error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
