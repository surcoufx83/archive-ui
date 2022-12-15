import { Extension, File, Page, Version } from "../if";
import { FileService } from "./file.service";

let mockext: Extension = {
    id: 0, displayable: true, downloadable: true, ext: 'bar',
    indexable: true, mimetype: 'application/bar'
};

let mockpage1: Page = {
    id: 0, versionid: 1, pageno: 1, pagetype: 1, pagedata: ''
};

let mockpage2: Page = {
    id: 1, versionid: 1, pageno: 2, pagetype: 1, pagedata: ''
};

let mockpage3: Page = {
    id: 2, versionid: 0, pageno: 1, pagetype: 1, pagedata: ''
};

let mockversion: Version = {
    id: 0, fileid: 0, num: 1, created: '2022-01-01', indexed: null,
    hasocr: false, ext: mockext, extid: mockext.id, words: null,
    stats: null, pages: {
        1: mockpage1,
        2: mockpage2
    }
};

let mockversion2: Version = {
    id: 0, fileid: 0, num: 2, created: '2000-01-01', indexed: null,
    hasocr: true, ext: null, extid: null, pages: null,
    words: null, stats: null
};

let mockfile: File = {
    id: 0, directory: null, directoryid: null, class: null, classid: null,
    classifyDisabled: false, case: null, caseid: null, case_filetype: null,
    case_filetypeid: null, client: null, clientid: null,
    fileexists: true, partyaddress: null, partyaddressid: null, contact: null,
    contactid: null, name: 'foo.bar', date: '2022-01-01', islink: false,
    mtime: '2022-01-01', size: 0, hash: '', deldate: null, case_filename: null,
    case_filedescription: null, case_filestatus: null, case_pintop: false,
    fileclass_meta: null, relpath: '/foo.bar', attributes: null,
    istaxreceipt: false, taxyear: null, versions: { }, tags: []
};

describe('FileService', () => {

    let file: FileService;

    beforeEach(() => {
        file = new FileService();
        mockext.displayable = true;
        mockversion.ext = mockext;
        mockversion.pages = { 1: mockpage1, 2: mockpage2 };
        mockfile.versions = { 1: mockversion };
    });

    it('should return correct displayable flag', () => {
        expect(file.displayable(undefined)).toBeFalse();
        expect(file.displayable(null)).toBeFalse();
        expect(file.displayable(mockversion)).toBeTrue();
        mockext.displayable = false;
        expect(file.displayable(mockversion)).toBeFalse();
        mockversion.ext = null;
        expect(file.displayable(mockversion)).toBeFalse();
    });

    it('should return correct downloadable flag', () => {
        expect(file.downloadable(undefined)).toBeFalse();
        expect(file.downloadable(null)).toBeFalse();
        expect(file.downloadable(mockversion)).toBeTrue();
        mockext.downloadable = false;
        expect(file.downloadable(mockversion)).toBeFalse();
    });

    it('should return correct version object', () => {
        expect(file.version(undefined)).toBeNull();
        expect(file.version(null)).toBeNull();
        expect(file.version(mockfile)).toEqual(mockversion);
        mockfile.versions[2] = mockversion2;
        expect(file.version(mockfile)).not.toEqual(mockversion);
        expect(file.version(mockfile)).toEqual(mockversion2);
        mockfile.versions = {};
        expect(file.version(mockfile)).toBeNull();
    });

    it('should return correct pages array', () => {
        expect(file.pages(undefined)).toBeNull();
        expect(file.pages(null)).toBeNull();
        expect(file.pages(mockfile)).toEqual([ mockpage1, mockpage2 ]);
        mockversion.pages = null;
        expect(file.pages(mockfile)).toBeNull();
        mockversion.pages = {};
        expect(file.pages(mockfile)).toEqual([]);
        mockversion.pages = { 1: mockpage3 };
        expect(file.pages(mockfile)).toEqual([ mockpage3 ]);
    });

    it('should return correct page object', () => {
        expect(file.page(undefined, 1)).toBeNull();
        expect(file.page(null, 1)).toBeNull();
        expect(file.page(mockfile, 0)).toBeNull();
        expect(file.page(mockfile, 1)).toEqual(mockpage1);
        expect(file.page(mockfile, 2)).toEqual(mockpage2);
        expect(file.page(mockfile, 3)).toBeNull();
    });


});