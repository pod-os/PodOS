# pos-tool-attachments

<!-- Auto Generated Below -->


## Overview

A tool to manage attachments of a thing.

## Dependencies

### Depends on

- [pos-attachments](../../components/pos-attachments)
- [pos-upload](../../components/pos-upload)

### Graph
```mermaid
graph TD;
  pos-tool-attachments --> pos-attachments
  pos-tool-attachments --> pos-upload
  pos-attachments --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  style pos-tool-attachments fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
