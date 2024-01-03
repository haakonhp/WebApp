import type {TemplateInsert} from "@/types/template";

export function CSVToArray(CSV: string): string[] {
    // Regex "burrowed" from Jonathan Hall's answer on https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text.
    return CSV.replace(/\s/g,'').split(",");
}

export function ArrayToCSV(tags: string[] | null): string {
    if(tags) {
        return tags.reduce((list, tag) => list.concat(tag, ", "), "").slice(0, -2);
    }
    return ""
}

export function transformTags(template: TemplateInsert): TemplateInsert {
    // We want to store tags as a comma seperated string for simplicity of storage, but to comply with Activities pattern (which
    // in turn is informed by the data retrieved from the JSON import, we expect tags as an string array from the input source.
    if (template.tags) {
        template.tagsStringable = ArrayToCSV(template.tags);
    }
    // Since the database don't actually want the tags, we can disregard it at this point.
    delete template.tags;
    return template
}