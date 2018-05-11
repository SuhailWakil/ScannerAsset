export default function renderIf(condition, content) {
    if (condition && condition != null && condition != 'null' && condition != '' && condition != 'undefined') {
        return content;
    } else {
        return null;
    }
}