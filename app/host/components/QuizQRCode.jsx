"use client";
import React, { useState } from "react";
import { IoQrCodeOutline } from "react-icons/io5";
import { BiHide } from "react-icons/bi";
import { QRCodeCanvas } from "qrcode.react";

const QuizQRCode = ({ roomId }) => {
    const [showQRCode, setShowQRCode] = useState(false);

    // Dynamic join URL for local
    // const joinUrl = `http://localhost:3000/join?roomId=${roomId}`;

    // Dynamic join URL for production
    const joinUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/join?roomId=${roomId}`;

    return (
        <div className="relative">
            {/* Open QR code button */}
            {!showQRCode && (
                <button
                    onClick={() => setShowQRCode(true)}
                    className="h-10 w-10 text-xl border border-purple-300 rounded-lg bg-white shadow flex justify-center items-center cursor-pointer hover:bg-zinc-100 transition-all duration-300"
                >
                    <IoQrCodeOutline />
                </button>
            )}

            {/* Generated QR code */}
            {showQRCode && (
                <div className="mr-3 mt-3 h-40 w-40 bg-white border border-purple-200 rounded-lg flex flex-col justify-center items-center relative shadow-lg">
                    {/* Actual QR Code */}
                    <QRCodeCanvas
                        value={joinUrl}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#000000" // purple color (can be customized)
                        level="H"
                        includeMargin={true}
                    />

                    <p className="text-xs text-gray-400 mt-1 text-center break-all">
                        scan QR for join the quiz
                    </p>

                    {/* Hide QR code button */}
                    <button
                        onClick={() => setShowQRCode(false)}
                        className="h-8 w-8 bg-white border border-purple-200 rounded-lg absolute -top-4 -right-4 flex justify-center items-center cursor-pointer hover:bg-zinc-100 transition-all duration-300"
                    >
                        <BiHide />
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizQRCode;
