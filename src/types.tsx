export interface TwitterUser {
  id: string;
  username: string;
  profile_image_url: string;
  name: string;
  public_metrics: {
    followers_count: number,
    following_count: number,
    tweet_count: number,
    listed_count: number
  },
}

export interface Error {
  error: any
}