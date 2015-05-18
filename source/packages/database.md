---
layout: base
activeMenu: documentation
title: Slick database package
contentsMenu: database/adapter
next:
    url: /packages/database/sql
    title: Creating queries

---

<div id="adapter"></div>

# Database Adapter

---

Database adapter is a vary powerful, yet lightweight object that allows you to
connect to database drivers and abstracts all the iteration you regularly need
when working with databases.

`Slick\Common\Database` has drivers for MySql and Sqlite out of the box but it
also has a very simple interface you can use to implement you own driver. It
has a separate interface for drivers of database systems that support
transactions.
 
## Creating an adapter

