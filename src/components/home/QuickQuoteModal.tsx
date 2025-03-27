'use client'

import React from 'react';
import Image from "next/image";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface QuickQuoteModalProps {
  showQuoteDialog: boolean;
  handleCloseDialog: () => void;
}

const QuickQuoteModal = ({ showQuoteDialog, handleCloseDialog }: QuickQuoteModalProps) => {
    return (
        <>
         
      <Dialog open={showQuoteDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] bg-[#bed6fb] p-0 overflow-hidden">
          <DialogHeader className="p-0">
            <div className="w-full h-60 overflow-hidden">
              <Image
                height={300}
                width={300}
                src="https://texastreeservicedirectory.com/lovable-uploads/dd0aeb9a-2604-45fd-a461-1e2ee5d2df5c.png"
                alt="Tree Service Quote Request"
                className="w-full h-auto object-cover"
              />
            </div>
          </DialogHeader>

          <div className="h-[calc(90vh-16rem)] w-full">
            <iframe
              src="https://tally.so/r/wQ4dNg"
              className="w-full h-full border-0"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Dry Cleaning Order Form"
            >
              Loading…
            </iframe>
          </div>
        </DialogContent>
      </Dialog>   
        </>
    );
};

export default QuickQuoteModal;