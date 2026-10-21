⚜️ SL PERFUMARIA — TECHNICAL SPECIFICATION PROMPT

Requirements Document and Master Development Prompt

Local Application for Inventory Management, POS, and Perfumery

📌 Project Overview

The SL Perfumaria system is a locally running web application (Desktop/Localhost) developed exclusively for internal store management. The system serves a single-user operation, prioritizing speed, ease of use, precise control of olfactory products, and data security via automatic cloud backups.

🎨 Visual Identity (Royal Gold & Night Black)

The design follows a high-luxury Dark Mode concept:

Main Background: #121212 (Soft Black)

Cards / Modals / Surfaces: #1E1E1E (Dark Graphite)

Borders and Dividers: #2D2D2D

Primary Highlight / Main Buttons: #D4AF37 (Metallic Yellow Gold)

Gold Button Hover: #C5A059

Main Text: #F5F5F5 (Off-White)

Secondary / Muted Text: #A3A3A3

Status Colors:

🟢 Green / Success: #4ADE80

🟡 Yellow / Stock Alert: #FBBF24

🔴 Red / Deduction or Outlet: #F87171

💻 Architecture & Tech Stack

Front-end: Vite + React (JSX), Tailwind CSS, Lucide React (Icons), Axios.

Back-end: Java 17+ (Spring Boot), Spring Web, Spring Data JPA, Spring Scheduling.

Database: SQLite (sl_perfumaria.db saved locally in the project directory).

Backup: Scheduled module (@Scheduled) in Spring Boot with periodic export of the database file to a Google Drive folder + Manual button in the interface.

🗄️ Database Schema (SQLite)

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    marca TEXT NOT NULL,
    volumetria TEXT NOT NULL,
    familia_olfativa TEXT NOT NULL,
    notas_topo TEXT,
    notas_coracao TEXT,
    notas_fundo TEXT,
    preco_custo REAL NOT NULL,
    preco_venda REAL NOT NULL,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 3,
    codigo_barras TEXT UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor_total REAL NOT NULL,
    forma_pagamento TEXT NOT NULL,
    desconto REAL DEFAULT 0.0,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_venda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER,
    produto_id INTEGER,
    quantidade INTEGER NOT NULL,
    preco_unitario REAL NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    tipo TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    motivo TEXT,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);


🤖 MASTER PROMPT (Copy and Paste to Generate Code)

Act as a Senior Full-Stack Software Engineer specialized in Java and React. Build the local management and checkout system for "SL Perfumaria".

CRITICAL INSTRUCTION: DO NOT INCLUDE ANY CODE COMMENTS IN ANY GENERATED FILE (NO INLINE COMMENTS, NO BLOCK COMMENTS, NO JAVADOC, NO JSX COMMENTS).

### 1. DESIGN AND THEME REQUIREMENTS
Apply the "Royal Gold & Night Black" visual concept:
- General background: #121212
- Cards and Modals: #1E1E1E
- Borders: #2D2D2D
- Highlights, main titles, and action buttons: #D4AF37 (Gold)
- Main text: #F5F5F5 (Off-White)
- Use Tailwind CSS for all styling in React.

### 2. TECHNICAL STRUCTURE
- Front-end: Vite + React, Tailwind CSS, Lucide React Icons, Axios.
- Back-end: Java (Spring Boot / Java 17+), Spring Web, Spring Data JPA, SQLite JDBC.
- Database: SQLite storing data in the local file 'sl_perfumaria.db'.

### 3. MANDATORY FUNCTIONAL REQUIREMENTS

MODULE 1: INTELLIGENT SEARCH & OLFACTORY SHOWCASE
- Global quick search bar by Name, Brand, Barcode, or Olfactory Notes.
- Dropdown filter by Olfactory Family (Woody, Oriental, Floral, Gourmand, Citrus, etc.).
- Product Card display showing: Name, Brand, Volume, Retail Price, Stock Quantity, and detailed Olfactory Pyramid (Top, Heart, and Base Notes).

MODULE 2: INVENTORY MANAGEMENT (INFLOWS AND OUTFLOWS)
- Perfume Registration and Editing Screen.
- Batch Inflow (Stock increase + cost/retail price update).
- Manual Outflow Adjustment with reason selection (Sample/Tester, Damage/Loss, Personal Use, Gift).
- Visual highlight in yellow/gold for items with stock equal to or below minimum stock threshold.

MODULE 3: POINT OF SALE / POS (STREAMLINED OPERATION)
- Simplified interface for a single operator.
- Fast item addition to cart via search bar or barcode scanner.
- Discount application and payment method selection (Pix, Credit Card, Debit Card, Cash).
- Sale completion with instant automatic stock deduction and transaction recording.

MODULE 4: AUTOMATIC CLOUD BACKUP (GOOGLE DRIVE)
- Scheduled service in Spring Boot (@Scheduled) to periodically export the 'sl_perfumaria.db' file to the configured Google Drive folder.
- "Backup Now" button in the dashboard header for immediate execution with on-screen confirmation notification.

MODULE 5: SIMPLE FINANCIAL DASHBOARD
- Daily and monthly revenue summary.
- Estimated Gross Profit calculation.
- Ranking of top-selling fragrances and brands.

Create clean, modularized, well-structured code with production-ready components. STRICTLY DO NOT INCLUDE ANY COMMENTS IN THE CODE.
