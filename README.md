# Fullstack Notion Clone - NoteIt

## Descriere

Acest proiect reprezintă o clonă a aplicației Notion, un instrument de productivitate folosit pentru organizarea informațiilor. Aplicația include funcționalități avansate pentru gestionarea notițelor, documentelor, și posibilitatea de a publica documente online. Este construită folosind o infrastructura bazata pe urmatoarele tehnologii: **Next.js 15**, **React 19**, **Tailwind CSS**, și integrarea autentificării prin **Clerk**.

## Funcționalități

### 1. Autentificare și Autorizare

- **Clerk Authentication**: Autentificarea utilizatorilor este gestionată prin **Clerk**, ce oferă o soluție rapidă și sigură pentru login-ul și înregistrarea utilizatorilor.
- **User Profiles**: Fiecare utilizator are un profil personalizat, incluzând setări, imagine de profil și detalii despre cont.

### 2. Gestionarea Notițelor

- Utilizatorii pot crea, edita și organiza notițele lor într-o manieră intuitivă.
- Suport pentru formatarea textului, adăugarea de imagini, tabele și liste.
- Posibilitatea de a căuta și filtra notițele pe baza unor cuvinte-cheie.
- Aceste funcționalități au fost implementate cu ajutorul bibliotecii **BlocknoteJS**, care permite construirea unui editor de texte avansat și ușor de utilizat, oferind o experiență fluidă și eficientă.

### 3. Design Responsiv și Modern

- Utilizarea **Tailwind CSS** pentru un design responsiv și personalizat.
- Animări și tranziții dinamice, incluzând efecte de hover și animații la încărcarea paginii.
- Design modern inspirat de aplicația Notion, cu o interfață ușor de utilizat și accesibilă pe toate dispozitivele.

### 4. Funcționalități Avansate de Colaborare

- Posibilitatea de a partaja notițe și documente cu alți utilizatori.

### 5. Managementul Setărilor Utilizatorului

- Utilizatorii pot accesa și modifica setările contului lor (e.g. schimbarea imaginii de profil, actualizarea email-ului etc.).
- **Meniu de utilizator** cu opțiuni de configurare a contului și deconectare.

## Tehnologii Folosite

### Frontend:

- **React 19**: Framework-ul principal folosit pentru construirea interfeței utilizatorului, bazat pe componente și hooks.
- **Next.js 15**: Framework-ul pentru React care permite server-side rendering (SSR) și static site generation (SSG) pentru performanță optimă.
- **Tailwind CSS**: Un framework CSS utilitar, folosit pentru a crea un design rapid și responsive.
- **Lucide React**: O bibliotecă de iconuri, folosită pentru a adăuga iconuri moderne și intuitive.
- **ShadCN UI**: Biblioteca pentru crearea de componente accesibile și personalizabile, cum ar fi **DropdownMenu**, **Dialog**, **Avatar** etc.
- **Redux Toolkit**: Este folosit pentru gestionarea stării globale a aplicației. Aceasta permite stocarea și actualizarea stării UI într-un mod centralizat, astfel încât să fie ușor de gestionat și de urmărit modificările în aplicație.
- **clsx**: O bibliotecă utilitară pentru manipularea claselor CSS.

### Autentificare:

- **Clerk**: Utilizat pentru autentificarea utilizatorilor, inclusiv gestionarea sesiunilor, autentificarea social media ( Gihtub ), și crearea unui flux simplu de login și înregistrare.

### Backend:

- **Convex**: Este o bază de date în timp real, care furnizează un backend scalabil pentru aplicații moderne. Permite sincronizarea datelor în timp real între client și server, facilitând actualizări instantanee ale aplicației atunci când datele sunt modificate.
- **Edgestore**: Este folosit pentru gestionarea eficientă a datelor pe server, având un design orientat pe edge computing, ce permite o performanță optimizată în gestionarea stocării și accesului la date. În combinație cu Convex, **Edgestore** asigură o manipulare rapidă și sigură a datelor.

### Alte Biblioteci:

- **Zod**: Validarea datelor in API pentru a asigura că informațiile din aplicație sunt corecte și sigure.
- **Emoji-Mart**: Componente pentru inserarea și gestionarea emoji-urilor în notițe.
- **React Dropzone**: Permite încărcarea fișierelor prin drag and drop într-o manieră intuitivă.

### Instrumente de Dezvoltare:

- **ESLint**: Utilizat pentru a asigura un cod curat și consistent.
- **TypeScript**: Limbajul folosit pentru a oferi siguranță la tipuri și o dezvoltare robustă.
- **PostCSS**: Utilizat pentru preprocesarea și optimizarea CSS-ului.

## Arhitectura Aplicației

Aplicația este construită pe o arhitectură **Client-Server**:

- **Frontend**:

  - Interfața utilizatorului este construită în **React** cu **Next.js**, care permite renderizarea pe server și pe client, oferind performanță ridicată.
  - Utilizăm **Tailwind CSS** pentru a gestiona stilurile și **Lucide React** pentru iconuri.
  - Toate componentele sunt reutilizabile, bazate pe un sistem de **component-based architecture**, care ajută la scalabilitatea aplicației.

- **Backend**:
  - **Convex** este utilizat pentru gestionarea logicii aplicației pe server și pentru stocarea datelor în timp real, permițând actualizări instantanee ale aplicației atunci când datele se schimbă. Acest serviciu asigură sincronizarea rapidă a datelor între server și client.
  - **Edgestore** asigură stocarea rapidă și scalabilă a datelor pe server, oferind un mecanism eficient de accesare a acestora.

## `Item` Component – Arhitectura și Funcționalitățile

Componenta `Item` este o componentă reutilizabilă utilizată pentru a reprezenta un document sau un item într-o listă de documente. Ea permite gestionarea acțiunilor de expansiune, arhivare și crearea de note noi. De asemenea, oferă o interfață interactivă pentru a manipula documentele într-un sistem ierarhic, susținând structuri recursive.

### 1. Proprietăți (Props)

Componenta `Item` primește următoarele props pentru a controla comportamentul și aspectul său:

- **`id`**: Identificatorul unic al documentului (`Id<"documents">` generat de Convex).
- **`label`**: Titlul sau denumirea documentului.
- **`onClick`**: Funcția de callback apelată atunci când itemul este apăsat.
- **`icon`**: Iconița asociată documentului.
- **`active`**: Un boolean care indică dacă itemul este activ sau selectat.
- **`documentIcon`**: Iconiță personalizată a documentului (opțională).
- **`isSearch`**: Un boolean care indică dacă documentul se află într-un context de căutare.
- **`level`**: Nivelul de indentare al itemului, folosit pentru documentele imbricate (recursive).
- **`onExpand`**: Funcția de callback care este apelată atunci când documentul trebuie să fie expandid.
- **`expanded`**: Un boolean care indică dacă documentul este expandid sau nu.

### 2. Funcționalități

#### a. `onArchive`

Funcția de arhivare a documentului. Când utilizatorul apasă pe opțiunea de arhivare, documentul este mutat în coșul de gunoi, iar utilizatorul este redirecționat la lista de documente. Un toast notifică utilizatorul despre succesul sau eșecul arhivării.

```ts
const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  event.stopPropagation(); // Previne propagarea evenimentului
  if (!id) return; // Verifică dacă există un ID
  const promise = archive({ id }).then(() => router.push("/documents")); // Arhivează documentul și redirecționează
  toast.promise(promise, {
    loading: "Moving to trash...",
    success: "Note moved to trash!",
    error: "Failed to archive note",
  });
};
```

#### b. `handleExpand`

Funcția de expansiune a documentului. Aceasta este apelată atunci când utilizatorul apasă pe iconița Chevron (dreapta/sus). Permite vizualizarea documentelor într-o structură imbricată.

```ts
const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  event.stopPropagation(); // Previne propagarea evenimentului
  onExpand?.(); // Apelează funcția de expansiune
};
```

#### c. `onCreate`

Funcția pentru crearea unui nou document sub documentul curent. După crearea documentului, utilizatorul este redirecționat către documentul nou creat. Dacă documentul nu este expandid, acesta va fi expus.

```ts
const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  event.stopPropagation(); // Previne propagarea evenimentului
  if (!id) return; // Verifică dacă există un ID
  const promise = create({ title: "Untitled", parentDocument: id }).then(
    (documentId) => {
      if (!expanded) {
        onExpand?.(); // Expandează documentul dacă nu este deja expandid
      }
      router.push(`/documents/${documentId}`); // Redirecționează către documentul nou creat
    }
  );
  toast.promise(promise, {
    loading: "Creating a new note...",
    success: "New note created!",
    error: "Failed to create a new note",
  });
};
```

### 3. Recursivitatea și Imbricarea Documentelor

Componenta Item este utilizată într-un sistem care permite gestionarea documentelor într-o structură ierarhică. Prop-ul level este folosit pentru a controla nivelul de indentare a documentelor în listă. Dacă un document are subdocumente, acestea sunt gestionate recursiv prin aceeași componentă Item, creând astfel o structură ierarhică.
