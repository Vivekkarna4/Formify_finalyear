"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { db } from "@/config";
import { featureRequests } from "@/config/schema";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export function FeatureRequestModal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.warning("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await db.insert(featureRequests).values({
        title,
        description,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD/MM/YYYY"),
      });

      toast.success("Feature request submitted successfully!");
      setTitle("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting feature request:", error);
      toast.error("Failed to submit feature request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Request a Feature</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request a New Feature</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="Feature title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Feature description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
