"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Themes from "../../../_data/Themes";
import GradientBg from "../../../_data/GradientBg";
import Style from "../../../_data/Style";
import Fields from "../../../_data/Fields";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Controller = ({
  selectedTheme,
  selectedBackground,
  selectedStyle,
  setSignInEnabled,
  addField,
  isTemplate,
  setIsTemplate,
  isActive,
  setIsActive,
  signInEnabled,
}) => {
  const [showMore, setShowMore] = useState(6);
  const [fields, setFields] = useState([]);

  const toCamelCase = (str) => {
    return str
      .replace(/\s(.)/g, (match) => match.toUpperCase())
      .replace(/\s/g, "")
      .replace(/^./, (match) => match.toLowerCase());
  };

  const addNewField = (type) => {
    addField({
      fieldName: toCamelCase("enter your label"),
      fieldTitle: "enter your label",
      fieldType: type,
      label: "enter your label",
      options:
        type !== "text" && type !== "file"
          ? [
              { value: "Option 1", label: "Option 1" },
              { value: "Option 2", label: "Option 2" },
            ]
          : null,
      placeholder: type === "text" ? "enter your placholder" : null,
    });
  };

  return (
    <div className="hidden md:flex flex-col gap-6 bg-muted/20 p-6 rounded-xl border h-fit">
      <Tabs defaultValue="design" className="flex flex-col gap-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="flex flex-col gap-4">
          {/* Theme selection */}
          <div className="flex flex-col gap-2">
            <h2>Select Theme</h2>
            <Select onValueChange={(value) => selectedTheme(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {Themes.map((theme, index) => (
                  <SelectItem key={index} value={theme.theme}>
                    <div className="flex gap-3">
                      <div className="flex">
                        <div
                          className="h-5 w-5 rounded-l-md"
                          style={{ backgroundColor: theme.primary }}
                        ></div>
                        <div
                          className="h-5 w-5"
                          style={{ backgroundColor: theme.secondary }}
                        ></div>
                        <div
                          className="h-5 w-5"
                          style={{ backgroundColor: theme.accent }}
                        ></div>
                        <div
                          className="h-5 w-5 rounded-r-md"
                          style={{ backgroundColor: theme.neutral }}
                        ></div>
                      </div>
                      <div>{theme.theme}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background selection */}
          <div className="flex flex-col gap-2">
            <h2>Select Background</h2>
            <div className="grid grid-cols-3 gap-5">
              {GradientBg.map(
                (bg, index) =>
                  index < showMore && (
                    <div
                      key={index}
                      className="w-full h-[70px] cursor-pointer flex justify-center items-center rounded-lg"
                      style={{ background: bg.gradient }}
                      onClick={() => selectedBackground(bg.gradient)}
                    >
                      {index === 0 && "None"}
                    </div>
                  )
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowMore(showMore > 6 ? 6 : 20)}
            >
              {showMore > 6 ? "Less" : "Show More"}
            </Button>
          </div>

          {/* Style selection */}
          <div className="flex flex-col gap-4">
            <h2>Select Style</h2>
            <div className="grid grid-cols-3 gap-3">
              {Style.map((style, index) => (
                <div key={index}>
                  <div
                    className="cursor-pointer hover:border-4 rounded-xl p-1"
                    onClick={() => selectedStyle(style)}
                  >
                    <Image
                      src={style.img}
                      alt={style.name}
                      width={600}
                      height={80}
                      className="rounded-lg"
                    />
                  </div>
                  <h2 className="text-center">{style.name}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Add fields */}
          <div className="flex flex-col gap-3">
            <h2>Add Fields</h2>
            <div className="flex flex-wrap gap-3">
              {Fields.map(({ id, icon: Icon, title }) => (
                <div
                  key={id}
                  onClick={() => addNewField(id)}
                  className="flex flex-col items-center justify-center py-3 px-4 gap-[2px] border-border cursor-pointer bg-background rounded-lg"
                >
                  <Icon className="w-6 h-6" />
                  {title}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex flex-col gap-4 -mt-6">
          {/* Template toggle */}
          <div className="flex items-center justify-between border p-4 rounded-xl">
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-base font-medium">Make Public Template</h2>
              <p className="text-muted-foreground text-sm">
                Allow others to use this as a starting point while keeping your
                original content unchanged.
              </p>
            </div>
            <Switch
              checked={isTemplate}
              onCheckedChange={() => setIsTemplate((prev) => !prev)}
            />
          </div>

          {/* Deactivate toggle */}
          <div className="flex items-center justify-between border p-4 rounded-xl">
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-base font-medium">Deactivate Form</h2>
              <p className="text-muted-foreground text-sm">
                Disable this form to prevent new submissions while keeping data
                intact.
              </p>
            </div>
            <Switch
              checked={!isActive}
              onCheckedChange={() => setIsActive((prev) => !prev)}
            />
          </div>

          {/* Social auth checkbox */}
          <div className="flex items-center gap-4 border p-4 rounded-xl">
            <Checkbox defaultChecked={signInEnabled} onCheckedChange={(e) => setSignInEnabled(e)} />
            <h2>Enable Social Authentication before submitting</h2>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Controller;
