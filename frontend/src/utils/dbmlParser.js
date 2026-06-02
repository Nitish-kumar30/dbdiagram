import { Parser } from '@dbml/core';

const parser = new Parser();

function cleanName(value = '') {
  return String(value).replace(/^['"]|['"]$/g, '');
}

function formatType(type) {


  if(!type){return '';}

  const typeName = type.type_name ||'';

  const args = Array.isArray(type.args) &&    type.args.length > 0 ?   `(${type.args.join(', ')})` : '';

  return `${typeName}${args}`;
}

function readColumns(table) {
  return (table.fields || []).map((field) => ({
    name: field.name,
    type: formatType(field.type),
     pk:   Boolean(field.pk),
    fk:   false,
    notNull:  Boolean(field.not_null),
     unique:  Boolean(field.unique),
    increment:  Boolean(field.increment),
    note:  field.note ||null,
  }));
}

function relationFromEndpoints(source,target){
  if (source?.relation === '*' && target?.relation === '1'){
    return 'many-to-one';
  }

  if (source?.relation === '1' && target?.relation === '*') {
    return 'one-to-many';
  }

  return 'one-to-one';
}

function readRefs(schema) {
  return (schema?.refs || []).flatMap((ref) =>{
    const [source, target] = ref.endpoints ||[];

    if (!source ||!target) {
      return [];
    }

    return[
      {name: ref.name || '',
        fromTable: cleanName(source.tableName),
        fromCol: cleanName(source.fieldNames?.[0] || ''),
        toTable: cleanName(target.tableName),
        toCol: cleanName(target.fieldNames?.[0] || ''),
        relation: relationFromEndpoints(source, target),
      },
    ];
  });
}

function readTables(db) {
  return (db?.schemas || []).flatMap((schema) => {
    return (schema.tables || []).map((table) => ({
      name: cleanName(table.name),
      columns: readColumns(table),
    }));
  });
}

function markForeignKeys(tables, refs) {
  const foreignKeys = new Set(refs.map((ref) => `${ref.fromTable}.${ref.fromCol}`));

  return tables.map((table) => ({
    ...table,
    columns: table.columns.map((column) => ({
      ...column,
      fk: column.fk || foreignKeys.has(`${table.name}.${column.name}`),
    })),
  }));
}

export function parseDbml(input = '') {
  try {
    const db = parser.parse(String(input), 'dbml');
    const tables = readTables(db);
    const refs = db?.schemas?.flatMap((schema) => readRefs(schema)) || [];

    return {
      tables: markForeignKeys(tables, refs),
      refs,
      errors: [],
    };
  } catch {
    return {
      tables: [],
      refs: [],
      errors: [],
    };
  }
}
