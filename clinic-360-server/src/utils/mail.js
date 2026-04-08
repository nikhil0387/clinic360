import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export const bookingConfirmMail = async (userMail, data) => {
  const { slotData: slot } = data;
  const { doctorId } = data?.doctorData;

  const mailContent = {
    from: "Clinic 360",
    to: userMail,
    subject: "Appointment Booking Confirmation",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">Appointment Confirmed</h2>
          <p>Dear Patient,</p>
          <p>Your appointment has been successfully booked. Below are the details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Doctor:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.name
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Experience:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.experience
              } years</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Speciality:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.speciality
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.location
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
                slot.date
              ).toDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                slot.startTime
              } - ${slot.endTime}</td>
            </tr>
          </table>
          <p style="margin-top: 15px;">Please arrive 10 minutes before your scheduled appointment.</p>
          <p style="margin-top: 15px;">For any changes, contact the clinic.</p>
          <p style="margin-top: 15px;">Regards,<br><strong>Clinic 360</strong></p>
        </div>
      `,
  };
  await transporter.sendMail(mailContent);
};

export const bookingCancelMail = async (userMail, data) => {
  const {  slot ,doctorId} = data;

  const mailContent = {
    from: "Clinic 360",
    to: userMail,
    subject: "Appointment Cancellation Confirmation",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #c0392b; text-align: center;">Appointment Cancelled</h2>
          <p>Dear Patient,</p>
          <p>Your appointment has been cancelled successfully. Below were the details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Doctor:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.name
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Experience:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.experience
              } years</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Speciality:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.speciality
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                doctorId.location
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
                slot.date
              ).toDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                slot.startTime
              } - ${slot.endTime}</td>
            </tr>
          </table>
          <p style="margin-top: 15px;">If this was a mistake, please rebook your appointment.</p>
          <p style="margin-top: 15px;">For any assistance, contact the clinic.</p>
          <p style="margin-top: 15px;">Regards,<br><strong>Clinic 360</strong></p>
        </div>
      `,
  };

  await transporter.sendMail(mailContent);
};
