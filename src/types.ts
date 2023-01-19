export interface RepoType {
    id: number;
    html_url: string;
    name: string;
    language: string;
    forks: number;
    description: string;
    owner: {
        login: string;
    }
}