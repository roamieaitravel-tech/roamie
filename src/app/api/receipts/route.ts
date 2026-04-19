import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// For PDF generation, you'll need to add a library like html2pdf or pdfkit
// This is a placeholder implementation showing the API structure

interface ReceiptData {
  bookingId: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  travelers: number;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  flights: Array<{
    from: string;
    to: string;
    date: string;
    price: number;
  }>;
  hotels: Array<{
    name: string;
    nights: number;
    price: number;
  }>;
  activities: Array<{
    name: string;
    date: string;
    price: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReceiptData = await request.json();

    const {
      bookingId,
      destination,
      startDate,
      endDate,
      totalPrice,
      travelers,
      bookingReference,
      customerName,
      customerEmail,
    } = body;

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate PDF content (HTML string)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Roamie - Trip Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          
          .container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 700;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.95;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section h2 {
            font-size: 16px;
            font-weight: 700;
            color: #1C1C1E;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #FF6B35;
            padding-bottom: 10px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .info-item {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
          }
          
          .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
            font-weight: 600;
          }
          
          .info-value {
            font-size: 16px;
            color: #1C1C1E;
            font-weight: 600;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th {
            background: #f5f5f5;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #ddd;
          }
          
          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
            color: #333;
          }
          
          tr:last-child td {
            border-bottom: none;
          }
          
          .price {
            text-align: right;
            font-weight: 600;
            color: #FF6B35;
          }
          
          .summary {
            background: #f9f9f9;
            border: 2px solid #FF6B35;
            border-radius: 8px;
            padding: 20px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
          }
          
          .summary-row:last-child {
            margin-bottom: 0;
          }
          
          .summary-label {
            color: #666;
          }
          
          .summary-value {
            font-weight: 600;
            color: #1C1C1E;
          }
          
          .summary-row.total {
            border-top: 2px solid #ddd;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 16px;
          }
          
          .summary-row.total .summary-value {
            color: #FF6B35;
            font-size: 20px;
          }
          
          .booking-ref {
            background: #e8f5e9;
            border: 2px dashed #4caf50;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .booking-ref-label {
            font-size: 12px;
            color: #2e7d32;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: 600;
          }
          
          .booking-ref-number {
            font-size: 24px;
            font-weight: 700;
            color: #2e7d32;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
          }
          
          .footer {
            background: #f5f5f5;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
          }
          
          .footer p {
            margin-bottom: 8px;
          }
          
          .footer a {
            color: #FF6B35;
            text-decoration: none;
          }
          
          .footer a:hover {
            text-decoration: underline;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .container {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ROAMIE</h1>
            <p>Your AI Travel Companion</p>
          </div>
          
          <div class="content">
            <!-- Booking Reference -->
            <div class="booking-ref">
              <div class="booking-ref-label">Booking Reference</div>
              <div class="booking-ref-number">${bookingReference}</div>
            </div>
            
            <!-- Trip Details -->
            <div class="section">
              <h2>Trip Details</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Destination</div>
                  <div class="info-value">${destination}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Dates</div>
                  <div class="info-value">${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Travelers</div>
                  <div class="info-value">${travelers} ${travelers === 1 ? "Person" : "People"}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Total Price</div>
                  <div class="info-value" style="color: #FF6B35;">$${totalPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <!-- Customer Details -->
            <div class="section">
              <h2>Passenger Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Name</div>
                  <div class="info-value">${customerName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${customerEmail}</div>
                </div>
              </div>
            </div>
            
            <!-- Booking Summary -->
            <div class="section">
              <h2>Cost Breakdown</h2>
              <div class="summary">
                <div class="summary-row">
                  <span class="summary-label">Flights</span>
                  <span class="summary-value">$1,300.00</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Accommodation</span>
                  <span class="summary-value">$595.00</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Activities</span>
                  <span class="summary-value">$125.00</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Travel Insurance</span>
                  <span class="summary-value">$49.00</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Tax (8%)</span>
                  <span class="summary-value">$129.04</span>
                </div>
                <div class="summary-row total">
                  <span class="summary-label">TOTAL</span>
                  <span class="summary-value">$${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <!-- Important Info -->
            <div class="section">
              <h2>Important Information</h2>
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b35;">
                <p style="font-size: 13px; color: #333; line-height: 1.6; margin-bottom: 8px;">
                  <strong>Confirmation Emails:</strong> You will receive detailed confirmation emails from each provider (airline, hotel, activity booking) within 24 hours.
                </p>
                <p style="font-size: 13px; color: #333; line-height: 1.6; margin-bottom: 8px;">
                  <strong>Cancellation Policy:</strong> Review individual booking cancellation terms. Travel insurance covers sudden cancellations.
                </p>
                <p style="font-size: 13px; color: #333; line-height: 1.6;">
                  <strong>Support:</strong> For questions, visit our help center or contact support@roamie.com
                </p>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>ROAMIE</strong> - Your AI Travel Companion</p>
            <p>Questions? Email us at <a href="mailto:support@roamie.com">support@roamie.com</a> or visit <a href="https://roamie.com">roamie.com</a></p>
            <p style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">
              Generated on ${new Date().toLocaleDateString()} • Receipt #${bookingReference}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // In a real implementation, you would:
    // 1. Convert HTML to PDF using a library like html2pdf, puppeteer, or pdfkit
    // 2. Store the PDF in cloud storage (S3, Google Cloud Storage, etc.)
    // 3. Return the download URL or send it as an attachment

    // For now, returning the HTML that can be printed
    const receiptUrl = `data:text/html;base64,${Buffer.from(htmlContent).toString("base64")}`;

    // Save receipt record
    await supabase.from("receipts").insert({
      user_id: user.id,
      booking_id: bookingId,
      booking_reference: bookingReference,
      html_content: htmlContent,
    });

    return NextResponse.json({
      success: true,
      receiptUrl,
      html: htmlContent,
      message: "Receipt generated successfully",
    });
  } catch (error) {
    console.error("Receipt generation error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate receipt";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookingReference = request.nextUrl.searchParams.get("ref");

    if (!bookingReference) {
      return NextResponse.json(
        { error: "Booking reference required" },
        { status: 400 }
      );
    }

    // Fetch receipt
    const { data: receipt } = await supabase
      .from("receipts")
      .select("*")
      .eq("user_id", user.id)
      .eq("booking_reference", bookingReference)
      .single();

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      html: receipt.html_content,
      receiptUrl: `data:text/html;base64,${Buffer.from(receipt.html_content).toString("base64")}`,
    });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch receipt";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
