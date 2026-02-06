import {boolean, integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core"

export const JsonForms = pgTable('JsonForms', {
    id: serial('id').primaryKey(),
    jsonform: text('jsonform').notNull(),
    theme: varchar('theme'),
    background: varchar('background'),
    style: varchar('style'),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt').notNull(),
    enabledSignIn: boolean('enabledSignIn').default(false),
    isTemplate: boolean('isTemplate').default(false),
    fullName: varchar('fullName').default("Unknown User"),
    isActive: boolean('isActive').default(true),
});

export const userResponses = pgTable('userResponses', {
    id: serial('id').primaryKey(),
    jsonResponse: text('jsonResponse').notNull(),
    createdBy: varchar('createdBy').default('anonymus'),
    createdAt: varchar('createdAt').notNull(),
    formRef:integer('formRef').references(()=>JsonForms.id)
})

export const featureRequests = pgTable('featureRequests', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt').notNull(),
})
