from pathlib import Path
import re

root = Path('e:/vs')

for path in list(root.rglob('*.html')) + list(root.rglob('*.css')) + list(root.rglob('*.js')):
    if path.name == 'remove_comments.py':
        continue

    text = path.read_text(encoding='utf-8')

    if path.suffix.lower() == '.html':
        text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    else:
        out = []
        i = 0
        n = len(text)
        in_str = None
        escaped = False
        while i < n:
            ch = text[i]
            nxt = text[i + 1] if i + 1 < n else ''

            if in_str is not None:
                out.append(ch)
                if escaped:
                    escaped = False
                elif ch == '\\':
                    escaped = True
                elif ch == in_str:
                    in_str = None
                i += 1
                continue

            if ch in ('"', "'"):
                in_str = ch
                out.append(ch)
                i += 1
                continue

            if ch == '/' and nxt == '*':
                i += 2
                while i < n and not (text[i] == '*' and i + 1 < n and text[i + 1] == '/'):
                    i += 1
                if i < n:
                    i += 2
                continue

            if ch == '/' and nxt == '/':
                i += 2
                while i < n and text[i] != '\n':
                    i += 1
                continue

            out.append(ch)
            i += 1

        text = ''.join(out)

    path.write_text(text, encoding='utf-8')

print('Comments removed from HTML/CSS/JS files.')
