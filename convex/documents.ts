import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
// v este un obiect care conține validatori pentru tipurile de date
// mutation și query sunt importate din fișierul generat automat de Convex și sunt folosite pentru a defini funcții server-side care interacționează cu baza de date.
// Doc și Id sunt tipuri de date definite în fișierul de model (_generated/dataModel) pe care le poți folosi pentru a interacționa cu documentele din baza de date.

// Definirea unei mutații pentru crearea unui document
export const create = mutation({
  args: {
    title: v.string(), // Validarea parametrului 'title' ca string
    parentDocument: v.optional(v.id("documents")), // Validarea parametrului 'parentDocument' ca ID opțional de tip "documents"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Obținem identitatea utilizatorului din contextul de autentificare
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm o eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului din identitate
    const document = await ctx.db.insert("documents", {
      // Inserăm un document în baza de date
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false, // Inițial, documentul nu este arhivat
      isPublished: false, // Inițial, documentul nu este publicat
    });
    return document; // Returnăm documentul creat
  },
});

// Definirea unei interogări pentru obținerea documentelor pentru sidebar
export const getSiderbar = query({
  args: {
    parentDocument: v.optional(v.id("documents")), // Validarea parametrului 'parentDocument' ca ID opțional de tip "documents"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Obținem identitatea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm o eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const documents = await ctx.db // Interogăm baza de date pentru documente
      .query("documents")
      .withIndex(
        "by_user_parent",
        (
          q // Folosim un index pentru a căuta documentele utilizatorului, filtrate după parentDocument
        ) => q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false)) // Filtrăm documentele care nu sunt arhivate
      .order("desc") // Ordonăm rezultatele descrescător
      .collect(); // Colectăm documentele rezultate
    return documents; // Returnăm documentele obținute
  },
});

// Definirea unei mutații pentru arhivarea unui document
export const archive = mutation({
  args: { id: v.id("documents") }, // Validarea parametrului 'id' ca ID de tip "documents"
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Obținem identitatea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm o eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const existingDocument = await ctx.db.get(args.id); // Obținem documentul din baza de date folosind ID-ul
    if (!existingDocument) {
      throw new Error("Not found"); // Aruncăm o eroare dacă documentul nu există
    }
    // Verificăm dacă utilizatorul curent este proprietarul documentului
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized"); // Aruncăm o eroare dacă utilizatorul nu este autorizat
    }

    // Funcție recursivă pentru arhivarea documentelor copil
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex(
          "by_user_parent",
          (q) => q.eq("userId", userId).eq("parentDocument", documentId) // Căutăm documentele copil ale documentului curent
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true }); // Arhivăm documentul copil
        await recursiveArchive(child._id); // Apelăm recursiv funcția pentru copii
      }
    };
    const document = await ctx.db.patch(args.id, { isArchived: true }); // Arhivăm documentul principal
    recursiveArchive(args.id); // Arhivăm recursiv toate documentele copil
    return document; // Returnăm documentul arhivat
  },
});

// Interogare pentru obținerea documentelor arhivate (din coșul de gunoi)
export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const documents = await ctx.db // Interogăm baza de date pentru documentele arhivate ale utilizatorului
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId)) // Căutăm documentele utilizatorului
      .filter((q) => q.eq(q.field("isArchived"), true)) // Filtrăm documentele arhivate
      .order("desc") // Ordonăm descrescător
      .collect(); // Colectăm documentele
    return documents; // Returnăm documentele găsite
  },
});

// Mutație pentru restaurarea unui document arhivat
export const restore = mutation({
  args: {
    id: v.id("documents"), // Validarea ID-ului documentului
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const existingDocument = await ctx.db.get(args.id); // Obținem documentul din baza de date
    if (!existingDocument) {
      throw new Error("Not found"); // Aruncăm eroare dacă documentul nu există
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized"); // Aruncăm eroare dacă utilizatorul nu este autorizat
    }

    // Funcție recursivă pentru restaurarea documentelor copil
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex(
          "by_user_parent",
          (q) => q.eq("userId", userId).eq("parentDocument", documentId) // Căutăm documentele copil
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false }); // Restaurăm documentul copil
        await recursiveRestore(child._id); // Apelăm recursiv pentru copii
      }
    };

    const options: Partial<Doc<"documents">> = { isArchived: false }; // Setăm documentul ca nearchivat
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument); // Verificăm dacă documentul are un părinte
      if (parent?.isArchived) {
        options.parentDocument = undefined; // Eliminăm legătura cu părinte dacă este arhivat
      }
    }

    const document = await ctx.db.patch(args.id, options); // Restaurăm documentul
    recursiveRestore(args.id); // Restaurăm recursiv documentele copil
    return document; // Returnăm documentul restaurat
  },
});

// Mutație pentru eliminarea unui document din baza de date
export const remove = mutation({
  args: { id: v.id("documents") }, // Validarea ID-ului documentului
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const existingDocument = await ctx.db.get(args.id); // Obținem documentul din baza de date
    if (!existingDocument) {
      throw new Error("Not found"); // Aruncăm eroare dacă documentul nu există
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized"); // Aruncăm eroare dacă utilizatorul nu este autorizat
    }
    const document = await ctx.db.delete(args.id); // Ștergem documentul din baza de date
    return document; // Returnăm documentul șters
  },
});

// Interogare pentru obținerea documentelor publice nearchivate
export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId)) // Căutăm documentele utilizatorului
      .filter((q) => q.eq(q.field("isArchived"), false)) // Filtrăm documentele care nu sunt arhivate
      .order("desc") // Ordonăm descrescător
      .collect(); // Colectăm documentele
    return documents; // Returnăm documentele găsite
  },
});

// Interogare pentru obținerea unui document după ID
export const getById = query({
  args: { documentId: v.id("documents") }, // Validarea ID-ului documentului
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    const document = await ctx.db.get(args.documentId); // Obținem documentul din baza de date
    if (!document) {
      throw new Error("Not Found"); // Aruncăm eroare dacă documentul nu există
    }
    if (document.isPublished && !document.isArchived) {
      return document; // Returnăm documentul dacă este publicat și nu este arhivat
    }
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    if (document.userId !== userId) {
      throw new Error("Unauthorized"); // Aruncăm eroare dacă utilizatorul nu este autorizat
    }
    return document; // Returnăm documentul
  },
});

// Mutație pentru actualizarea unui document
export const update = mutation({
  args: {
    id: v.id("documents"), // Validarea ID-ului documentului
    title: v.optional(v.string()), // Parametru opțional pentru titlu
    content: v.optional(v.string()), // Parametru opțional pentru conținut
    coverImage: v.optional(v.string()), // Parametru opțional pentru imaginea de copertă
    icon: v.optional(v.string()), // Parametru opțional pentru iconiță
    isPublished: v.optional(v.boolean()), // Parametru opțional pentru starea de publicare
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const { id, ...rest } = args;
    const existingDocument = await ctx.db.get(args.id); // Obținem documentul din baza de date
    if (!existingDocument) {
      throw new Error("Not found"); // Aruncăm eroare dacă documentul nu există
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized"); // Aruncăm eroare dacă utilizatorul nu este autorizat
    }
    const document = await ctx.db.patch(args.id, { ...rest }); // Actualizăm documentul
    return document; // Returnăm documentul actualizat
  },
});

// Mutație pentru eliminarea iconiței unui document
export const removeIcon = mutation({
  args: { id: v.id("documents") }, // Validarea ID-ului documentului
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const existingDocument = await ctx.db.get(args.id); // Obținem documentul din baza de date
    if (!existingDocument) {
      throw new Error("Not found"); // Aruncăm eroare dacă documentul nu există
    }
    if (existingDocument.userId !== userId) {
      // Verificăm dacă utilizatorul este cel care a creat documentul
      throw new Error("Unauthorized"); // Aruncăm eroare dacă utilizatorul nu este autorizat
    }
    const document = await ctx.db.patch(args.id, { icon: undefined }); // Eliminăm iconița documentului
    return document; // Returnăm documentul actualizat
  },
});

// Mutație pentru eliminarea imaginii de copertă a unui document
export const removeCoverImage = mutation({
  args: { id: v.id("documents") }, // Validarea ID-ului documentului
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Verificăm autentificarea utilizatorului
    if (!identity) {
      throw new Error("Not authenticated"); // Aruncăm eroare dacă utilizatorul nu este autentificat
    }
    const userId = identity.subject; // Obținem ID-ul utilizatorului
    const existingDocument = await ctx.db.get(args.id); // Obținem documentul din baza de date
    if (!existingDocument) {
      throw new Error("Not found"); // Aruncăm eroare dacă documentul nu există
    }
    if (existingDocument.userId !== userId) {
      // Verificăm dacă utilizatorul este cel care a creat documentul
      throw new Error("Unauthorized"); // Aruncăm eroare dacă utilizatorul nu este autorizat
    }
    const document = await ctx.db.patch(args.id, { coverImage: undefined }); // Eliminăm imaginea de copertă
    return document; // Returnăm documentul actualizat
  },
});
