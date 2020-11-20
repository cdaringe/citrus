# citrus

the best fruit app to explore GTLT concepts.

## usage

- install rad
- `rad db`
- `rad startDevServer` (`rad sds` for short)

try it out:

```bash
curl http://localhost:7777/hello/1
# strawberry

curl 'http://localhost:7777/graphql' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary '{"query":"{\n\tallFruits {\n edges {\n node {\n name\n}\n }\n }\n}","variables":null}' \
  --compressed
# {"data":{"allFruits":{"edges":[{"node":{"name":"strawberry"}},{"node":{"name":"apple"}},{"node":{"name":"orange"}}]}}}
```
