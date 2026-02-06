"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import {
  Share2,
  Copy,
  Download,
  Twitter,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ShareButton = ({
  url,
  className,
  title = "Share", // optional custom title
  buttonText = "Share", // optional custom button text
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector("#share-qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Formify Form QR`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=Check out this form&body=${encodeURIComponent(
      url
    )}`;
    window.open(emailUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* QR Code */}
          <div className="border rounded-lg">
            <QRCodeSVG
              id="share-qr-code"
              value={url}
              size={160}
              marginSize={1}
              className="rounded-md"
              level="H"
            />
          </div>

          {/* Download QR Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownloadQR}
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>

          {/* URL Input with Copy */}
          <div className="flex items-center space-x-2 w-full">
            <Input value={url} readOnly className="flex-1" />
            <Button size="icon" variant="outline" onClick={handleCopyUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Social Sharing Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={shareOnTwitter}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={shareOnWhatsApp}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={shareViaEmail}
            >
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Share this link with others
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
