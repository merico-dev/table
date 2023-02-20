import sys
import sqlparse
from sqlparse.tokens import (
    DDL,
    DML,
    Keyword,
)

parsed = sqlparse.parse(sys.argv[1])

def is_select(parsed_sql) -> bool:
  if parsed_sql.get_type() == "SELECT":
    return True

  if parsed_sql.get_type() != "UNKNOWN":
    return False

  # for `UNKNOWN`, check all DDL/DML explicitly: only `SELECT` DML is allowed,
  # and no DDL is allowed
  if any(token.ttype == DDL for token in parsed_sql) or any(
    token.ttype == DML and token.value != "SELECT" for token in parsed_sql
  ):
      return False

  # return false on `EXPLAIN`, `SET`, `SHOW`, etc.
  if parsed_sql[0].ttype == Keyword:
    return False

  return any(
      token.ttype == DML and token.value == "SELECT" for token in parsed_sql
  )

print(parsed[0], '_;_', is_select(parsed[0]))